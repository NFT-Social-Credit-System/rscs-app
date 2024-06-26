import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No token found' }, { status: 401 });
  }

  try {
    const client = new TwitterApi(token);
    const user = await client.v2.me();
    
    // If verification is successful, return user data
    return NextResponse.json(user.data);
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ error: 'Error verifying authentication' }, { status: 401 });
  }
}
