import { NextResponse } from 'next/server';
import connectDB from '@rscs-backend/backend/db';
import User from '@rscs-backend/backend/models/TwitterUserData';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Connect to the database
    await connectDB();

    // Check if the user exists in the database
    const user = await User.findById(userId);

    if (user) {
      // Simulate claiming account logic
      const success = true; // Replace with actual logic

      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, message: 'Failed to claim account' });
      }
    } else {
      return NextResponse.json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in claim-account:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' });
  }
}
