import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../../utils/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username } = req.query;
  const { walletAddress } = req.body;

  if (!username || !walletAddress) {
    return res.status(400).json({ message: 'Missing username or wallet address' });
  }

  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('Users');

    // Find the user and remove their votes
    const result = await usersCollection.findOneAndUpdate(
      { username: username as string },
      {
        $pull: { votes: { voter: walletAddress } } as any
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Recalculate the score
    const upVotes = result.votes?.filter((v: { voteType: string }) => v.voteType === 'up').length || 0;
    const downVotes = result.votes?.filter((v: { voteType: string }) => v.voteType === 'down').length || 0;

    // Update the score
    const updatedUser = await usersCollection.findOneAndUpdate(
      { username: username as string },
      { $set: { 'score.up': upVotes, 'score.down': downVotes } },
      { returnDocument: 'after' }
    );

    res.status(200).json(updatedUser || { message: 'User updated but not returned' });
  } catch (error) {
    console.error('Error removing votes:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
