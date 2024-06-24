"use client";

import React, { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

/**
 * @author Ozzy(@Zerocousin) for Remilia Social Credit System
 */

const WalletConnect: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [votingWeight, setVotingWeight] = useState<number | null>(null);
  const [eligible, setEligible] = useState<boolean | null>(null);

  // Function to check voting eligibility
  const checkEligibility = async () => {
    if (!address) return;

    try {
      const response = await fetch(`/api/check-voting?address=${address}`);
      const data = await response.json();
      setEligible(data.eligible);
      setVotingWeight(data.votingWeight);
    } catch (error) {
      console.error('Error checking voting eligibility:', error);
    }
  };

  // Check eligibility when wallet is connected
  useEffect(() => {
    if (isConnected) {
      checkEligibility();
    }
  }, [isConnected, address]);

  return (
    <div>
      <ConnectButton />
      {isConnected && eligible !== null && (
        <div>
          {eligible ? (
            <p>Eligible to vote with weight: {votingWeight}</p>
          ) : (
            <p>Not eligible to vote</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;