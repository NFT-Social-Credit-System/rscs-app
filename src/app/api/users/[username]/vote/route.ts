import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/mongodb';
const TwitterUser = require('@rscs-backend/backend/models/TwitterUserData');

export async function POST(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to database');
    
    const { username } = params;
    const { isUpvote, weight, voter } = await request.json();
    
    const user = await TwitterUser.findOne({ username });
    if (!user) {
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
    
    await user.save();
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user score:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
