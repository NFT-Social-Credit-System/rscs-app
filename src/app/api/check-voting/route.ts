import { NextRequest, NextResponse } from 'next/server';
import { checkVotingEligibility } from '@/lib/checkBalance';

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }

  try {
    const votingWeight = await checkVotingEligibility(address);
    if (votingWeight > 0) {
      return NextResponse.json({ eligible: true, votingWeight });
    } else {
      return NextResponse.json({ eligible: false });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
