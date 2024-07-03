import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  try {
    const { db } = await connectToDatabase();

    if (username) {
      // Handle single user fetch
      const user = await db.collection('Users').findOne({ username: username.toLowerCase() });

      if (user) {
        return NextResponse.json({ message: 'User found', user }, { status: 200 });
      } else {
        return NextResponse.json({ message: 'User not found yet' }, { status: 202 });
      }
    } else {
      // Handle all users fetch
      const users = await db.collection('Users').find({}).toArray();
      return NextResponse.json(users);
    }
  } catch (error) {
    console.error('Error fetching user(s):', error);
    return NextResponse.json({ error: 'Failed to fetch user(s)' }, { status: 500 });
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

    // If user doesn't exist, initiate the scrape process
    console.log('Requesting scrape for:', username);
    await axios.post('http://95.217.2.184:5000/scrape', {
      username,
      timestamp: new Date().getTime()
    });

    // Poll the database for the new user
    let newUser = null;
    let attempts = 0;
    while (!newUser && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between checks
      newUser = await db.collection('Users').findOne({ username: username.toLowerCase() });
      attempts++;
    }

    if (newUser) {
      return NextResponse.json({ message: 'User added successfully', user: newUser }, { status: 201 });
    } else {
      return NextResponse.json({ message: 'User creation initiated, but not yet completed', username }, { status: 202 });
    }

  } catch (error) {
    console.error('Error initiating user addition:', error);
    return NextResponse.json({ message: 'Error initiating user addition' }, { status: 500 });
  }
}
