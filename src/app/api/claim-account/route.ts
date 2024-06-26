import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/mongodb';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isClaimed) {
      return NextResponse.json({ error: 'Account already claimed' }, { status: 400 });
    }

    await usersCollection.updateOne(
      { _id: userId },
      { $set: { isClaimed: true } }
    );

    return NextResponse.json({ message: 'Account claimed successfully' });
  } catch (error) {
    console.error('Error claiming account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
