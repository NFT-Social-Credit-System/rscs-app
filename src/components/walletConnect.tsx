"use client";

import React, { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

/**
 * @author Ozzy(@Zerocousin) for Remilia Social Credit System
 */

const WalletConnect: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { signMessage } = useSignMessage();
  const [votingWeight, setVotingWeight] = useState<number | null>(null);
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [signatureError, setSignatureError] = useState<string | null>(null);

  const handleSign = async () => {
    if (!address) return;
    try {
      const message = "Sign this message to verify your wallet ownership";
      await signMessage({ message });
      setIsSigned(true);
      await checkEligibility();
    } catch (error) {
      console.error('Error signing message:', error);
      setSignatureError('Signature failed');
    }
  };

  const checkEligibility = async () => {
    if (!address) return;
    try {
      const response = await fetch(`/api/check-voting?address=${address}`); 
      const data = await response.json();
      setEligible(data.eligible);
      setVotingWeight(data.votingWeight);
      if (!data.eligible) {
        setSignatureError("You can't vote without Remilia Eco NFTs - please visit our Docs");
      }
    } catch (error) {
      console.error('Error checking voting eligibility:', error);
    }
  };

  useEffect(() => {
    if (isConnected && !isSigned) {
      handleSign();
    }
  }, [isConnected, isSigned]);

  return (
    <div className="relative w-full">
      <div className="absolute right-0">
        <ConnectButton />
      </div>
      {signatureError && (
        <div className="absolute right-0 mt-12 text-yellow-500 animate-pulse">
          <div className="flex items-center justify-end">
            <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
            <span className="text-xs">{signatureError}</span>
          </div>
        </div>
      )}
      {isConnected && isSigned && eligible !== null && !signatureError && (
        <div className="absolute right-0 mt-16 text-sm bg-white p-2 rounded shadow-md">
          {eligible ? (
            <p className="text-green-500 font-semibold">Eligible to vote with weight: {votingWeight}</p>
          ) : (
            <p className="text-yellow-500 font-semibold">
              You can't vote without Remilia Eco NFTs - please visit our Docs
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;