"use client";

import React, { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWalletVoting } from './useWalletVoting';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { useAccount } from 'wagmi';

/**
 * @author Ozzy(@Zerocousin) for Remilia Social Credit System
 */

const WalletConnect: React.FC = () => {
  const { votingWeight, eligible, isSigned, signatureError, isConnected } = useWalletVoting();

  useEffect(() => {
    console.log('WalletConnect: Connection status changed', { isConnected, isSigned, eligible });
  }, [isConnected, isSigned, eligible]);

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
              You can&apos;t vote without Remilia Eco NFTs - please visit our Docs
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;