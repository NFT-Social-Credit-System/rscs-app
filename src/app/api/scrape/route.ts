import { NextResponse } from 'next/server';
import axios from 'axios';
import connectToDatabase from '../../../utils/mongodb';

export async function POST(req: Request) {
  const { username } = await req.json();

  try {
    const response = await axios.post('http://localhost:3000/api/scrape', { username });
    
    // Check if the user was saved in the database
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ username });

    if (user) {
      return NextResponse.json({ message: 'User scraped and saved successfully', user });
    } else {
      return NextResponse.json({ error: 'User not found in database after scraping' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error scraping user:', error);
    return NextResponse.json({ error: 'Failed to scrape user' }, { status: 500 });
  }
}
