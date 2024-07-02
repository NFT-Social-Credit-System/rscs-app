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

    // Check if user already exists
    const existingUser = await db.collection('Users').findOne({ username: username.toLowerCase() });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Request scrape from the server
    try {
      console.log('Requesting scrape for:', username);
      const scrapeResponse = await axios.post('http://95.217.2.184:5000/scrape', {
        username,
        timestamp: new Date().getTime()
      });
      console.log('Scrape response:', scrapeResponse.data);
      
      // Wait for a short time to allow the scraper to insert the user
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Fetch the newly created user
      const newUser = await db.collection('Users').findOne({ username: username.toLowerCase() });
      
      if (newUser) {
        return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
      } else {
        return NextResponse.json({ message: 'User creation pending' }, { status: 202 });
      }
    } catch (scrapeError) {
      if (axios.isAxiosError(scrapeError)) {
        console.error('Error requesting scrape:', scrapeError.response?.data || scrapeError.message);
      } else {
        console.error('Unknown error during scrape request:', scrapeError);
      }
      return NextResponse.json({ message: 'Failed to request user scrape' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
