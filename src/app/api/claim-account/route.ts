import { NextResponse } from 'next/server';
import { initialUsers } from '../../../components/InitialUserData'; // Adjust the path as necessary

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Check if the user exists in the initialUsers list
    const user = initialUsers.find(user => user.id === userId);

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
    return NextResponse.json({ success: false, message: 'An error occurred' });
  }
}
