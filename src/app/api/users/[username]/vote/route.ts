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
    const { voteType, weight } = await request.json();
    
    const user = await TwitterUser.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (voteType === 'up') {
      user.score.up += weight;
    } else if (voteType === 'down') {
      user.score.down += weight;
    }
    
    await user.save();
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user score:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
