import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID as string,
  clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    const { url, codeVerifier, state } = await client.generateOAuth2AuthLink(
      process.env.TWITTER_CALLBACK_URL as string,
      { scope: ['tweet.read', 'users.read', 'offline.access'] }
    );

    const response = NextResponse.json({ authUrl: url });
    response.cookies.set('codeVerifier', codeVerifier, { httpOnly: true, secure: true });
    response.cookies.set('state', state, { httpOnly: true, secure: true });
    response.cookies.set('userId', userId, { httpOnly: true, secure: true });

    return response;
  } catch (error) {
    console.error('Error generating auth link:', error);
    return NextResponse.json({ error: 'Failed to generate auth link' }, { status: 500 });
  }
}
