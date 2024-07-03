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
    try {
      console.log('Requesting scrape for:', username);
      await axios.post('http://95.217.2.184:5000/scrape', {
        username,
        timestamp: new Date().getTime()
      });

      // Wait for the user to be added to the database
      let newUser = null;
      let attempts = 0;
      while (!newUser && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        newUser = await db.collection('Users').findOne({ username: username.toLowerCase() });
        attempts++;
      }

      if (newUser) {
        return NextResponse.json({ message: 'User added successfully', user: newUser }, { status: 201 });
      } else {
        return NextResponse.json({ message: 'User creation pending', username }, { status: 202 });
      }
    } catch (error) {
      console.error('Error calling external API:', error);
      return NextResponse.json({ message: 'Error calling external API' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
