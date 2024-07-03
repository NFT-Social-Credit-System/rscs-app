import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/utils/mongodb';

export async function POST(request: NextRequest, { params }: { params: { username: string } }) {
  const { username } = params;
  const { walletAddress } = await request.json();

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
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
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

    return NextResponse.json(updatedUser || { message: 'User updated but not returned' });
  } catch (error) {
    console.error('Error removing votes:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
