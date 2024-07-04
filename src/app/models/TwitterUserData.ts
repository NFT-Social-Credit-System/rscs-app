import { ObjectId } from 'mongodb';

interface TwitterUser {
  _id?: ObjectId;
  username: string;
  name: string;
  profilePictureUrl?: string;
  followersCount: number;
  score: {
    up: number;
    down: number;
  };
  votes: Array<{
    voter: string;
    weight: number;
    voteType: 'up' | 'down';
    timestamp: Date;
  }>;
  status: 'Approved' | 'Moderate' | 'Risk';
  isRemiliaOfficial: boolean;
  isMiladyOG: boolean;
  hasGoldenBadge: boolean;
  isClaimed: boolean;
}

export default TwitterUser;
