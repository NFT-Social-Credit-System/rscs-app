import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('Users');
    
    const users = await usersCollection.find({}).toArray();
    
    if (users.length === 0) {
      return NextResponse.json({ error: 'No users found' }, { status: 404 });
    }
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
