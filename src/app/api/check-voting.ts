import type { NextApiRequest, NextApiResponse } from 'next';
import { checkVotingEligibility } from '@/lib/checkBalance';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Invalid address' });
  }

  try {
    const votingWeight = await checkVotingEligibility(address);
    if (votingWeight > 0) {
      res.status(200).json({ eligible: true, votingWeight });
    } else {
      res.status(200).json({ eligible: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}