import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import connectToDatabase from '@/utils/mongodb';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const state = searchParams.get('state');
  const code = searchParams.get('code');

  const codeVerifier = request.cookies.get('codeVerifier')?.value;
  const storedState = request.cookies.get('state')?.value;
  const userId = request.cookies.get('userId')?.value;

  if (!state || !code || !codeVerifier || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL('/?error=Invalid OAuth state', request.url));
  }

  try {
    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    });

    const {
      client: loggedClient,
      accessToken,
      refreshToken,
    } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: process.env.TWITTER_CALLBACK_URL as string,
    });

    const { data: userObject } = await loggedClient.v2.me();

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ username: userObject.username });

    if (!user) {
      return NextResponse.redirect(new URL('/?error=Please submit your username first!', request.url));
    }

    const alreadyClaimed = user.isClaimed;

    if (alreadyClaimed) {
      return NextResponse.redirect(new URL('/?error=You have already claimed your account!', request.url));
    }

    await usersCollection.updateOne(
      { username: userObject.username },
      { $set: { isClaimed: true } }
    );

    const response = NextResponse.redirect(new URL('/?auth=success', request.url));
    response.cookies.delete('codeVerifier');
    response.cookies.delete('state');
    response.cookies.delete('userId');
    return response;
  } catch (error) {
    console.error('Error in callback:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
