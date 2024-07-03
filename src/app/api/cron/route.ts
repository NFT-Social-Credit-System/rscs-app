import axios from 'axios';
import { NextResponse } from 'next/server';

const BASE_URL = 'http://95.217.2.184:5000';

export const runtime = 'edge';

export async function GET() {
  try {
    console.log('Starting scheduled scrape-all operation...');
    const response = await axios.post(`${BASE_URL}/scrape-all`, {
      timestamp: new Date().getTime()
    });
    console.log('Scrape-all operation initiated:', response.data.message);
    return NextResponse.json({ message: 'Scrape-all operation initiated' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error starting scrape-all operation:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Failed to initiate scrape-all operation' }, { status: 500 });
  }
}
