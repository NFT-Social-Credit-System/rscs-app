import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
const TwitterUser = require('@rscs-backend/backend/models/TwitterUserData');

export async function GET() {
  try {
    const conn = await connectToDatabase();
    const users = await TwitterUser.find({}).lean();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    const conn = await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await TwitterUser.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create new user
    const newUser = {
      username,
      name: username,
      followersCount: 0,
      profilePictureUrl: '',
      status: 'Moderate',
      isMiladyOG: false,
      isRemiliaOfficial: false,
      score: { up: 0, down: 0 },
      votes: [],
      isClaimed: false,
    };

    const result = await TwitterUser.create(newUser);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}