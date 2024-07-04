import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/mongodb';

export async function POST(
  request: Request,
  { params }: { params: { username: string } }
) {
  console.log('Vote API called', { params });
  try {
    console.log('Connecting to database...');
    const { client, db } = await connectToDatabase();
    console.log('Connected to database');
    
    const { username } = params;
    const { isUpvote, weight, voter } = await request.json();
    console.log('Vote data received', { username, isUpvote, weight, voter });
    
    const user = await db.collection('Users').findOne({ username });
    if (!user) {
      console.log('User not found', { username });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Remove any existing vote by this voter
    user.votes = user.votes.filter((vote: any) => vote.voter !== voter);
    
    // Add the new vote
    user.votes.push({
      voter,
      weight,
      voteType: isUpvote ? 'up' : 'down',
      timestamp: new Date()
    });
    
    // Recalculate the score
    user.score.up = user.votes.filter((vote: any) => vote.voteType === 'up')
      .reduce((sum: number, vote: any) => sum + vote.weight, 0);
    user.score.down = user.votes.filter((vote: any) => vote.voteType === 'down')
      .reduce((sum: number, vote: any) => sum + vote.weight, 0);
    
    console.log('Saving updated user', { username, newScore: user.score });
    await db.collection('Users').updateOne(
      { username },
      { $set: { votes: user.votes, score: user.score } }
    );
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user score:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
