import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import connectToDatabase from '../../../../../utils/mongodb';

const MILADY_CONTRACT = '0x5af0d9827e0c53e4799bb226655a1de152a425a5';
const OG_CUTOFF_DATE = new Date('2022-05-23T05:04:00Z').getTime() / 1000; // Convert to Unix timestamp

export async function POST(request: NextRequest, { params }: { params: { username: string } }) {
  const { username } = params;
  const { walletAddress } = await request.json();

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

    return NextResponse.json({ isMiladyOG });
  } catch (error) {
    console.error('Error checking Milady OG status:', error);
    return NextResponse.json({ message: 'Error checking Milady OG status' }, { status: 500 });
  }
}
