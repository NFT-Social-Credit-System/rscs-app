import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../utils/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const users = await db.collection('users').find({}).toArray();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    const { db } = await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create new user
    const newUser = {
      username,
      name: username, // Replace with real data
      followers: 0, // Replace with real data
      avatarUrl: '', // Replace with real data
      status: 'Moderate',
      isMiladyOG: false,
      isRemiliaOfficial: false,
      score: { up: 0, down: 0 },
      isClaimed: false,
    };

    const result = await db.collection('users').insertOne(newUser);
    const createdUser = { ...newUser, _id: result.insertedId };

    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}