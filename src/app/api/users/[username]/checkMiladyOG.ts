import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import connectToDatabase from '../../../../utils/mongodb';

const MILADY_CONTRACT = '0x5af0d9827e0c53e4799bb226655a1de152a425a5';
const OG_CUTOFF_DATE = new Date('2022-05-23T05:04:00Z').getTime() / 1000; // Convert to Unix timestamp

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username } = req.query;
  const { walletAddress } = req.body;

  try {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL || '');
    const contract = new ethers.Contract(MILADY_CONTRACT, ['event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'], provider);

    const filter = contract.filters.Transfer(null, walletAddress);
    const events = await contract.queryFilter(filter, 0, 'latest');

    // Check if any transfer occurred before the cutoff date
    const isMiladyOG = await events.some(async (event) => {
      const block = await event.getBlock();
      return block.timestamp < OG_CUTOFF_DATE;
    });

    // Update user's Milady OG status in the database
    const { db } = await connectToDatabase();
    await db.collection('Users').updateOne(
      { username: username as string },
      { $set: { isMiladyOG: isMiladyOG } }
    );

    res.status(200).json({ isMiladyOG });
  } catch (error) {
    console.error('Error checking Milady OG status:', error);
    res.status(500).json({ message: 'Error checking Milady OG status' });
  }
}
