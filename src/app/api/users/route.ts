import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
import axios from 'axios';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const users = await db.collection('Users').find({}).toArray();
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

    // Check if the user already exists
    const existingUser = await db.collection('Users').findOne({ username: username.toLowerCase() });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists in the database', user: existingUser }, { status: 200 });
    }

    // If user doesn't exist, proceed with adding them
    console.log('Requesting scrape for:', username);
    await axios.post('http://95.217.2.184:5000/scrape', {
      username,
      timestamp: new Date().getTime()
    });

    // Start polling for the user
    let attempts = 0;
    const maxAttempts = 15;
    const pollInterval = 2000;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      const newUser = await db.collection('Users').findOne({ username: username.toLowerCase() });
      
      if (newUser) {
        return NextResponse.json({ message: 'User added successfully', user: newUser }, { status: 201 });
      }
      
      attempts++;
    }

    return NextResponse.json({ message: 'User creation pending', username }, { status: 202 });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
