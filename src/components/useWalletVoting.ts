import { useState, useEffect, useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { checkVotingEligibility } from '../lib/checkBalance';

export const useWalletVoting = () => {
  const { address, isConnected, chain } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [votingWeight, setVotingWeight] = useState<number | null>(null);
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [signatureError, setSignatureError] = useState<string | null>(null);

  const checkEligibility = useCallback(async () => {
    if (!address) return;
    try {
      const weight = await checkVotingEligibility(address);
      setVotingWeight(weight);
      setEligible(weight > 0);
    } catch (error) {
      console.error('Error checking voting eligibility:', error);
      setEligible(false);
      setVotingWeight(0);
    }
  }, [address]);

  const handleSign = useCallback(async () => {
    if (!address) return;
    try {
      const message = "Sign this message to verify your wallet ownership";
      await signMessageAsync({ message });
      setIsSigned(true);
      await checkEligibility();
    } catch (error) {
      console.error('Error signing message:', error);
      setSignatureError('Signature failed');
    }
  }, [address, signMessageAsync, checkEligibility]);

  useEffect(() => {
    if (isConnected && !isSigned) {
      handleSign();
    } else if (!isConnected) {
      setVotingWeight(null);
      setEligible(null);
      setIsSigned(false);
      setSignatureError(null);
    }
  }, [isConnected, isSigned, handleSign]);

  useEffect(() => {
    if (isConnected && isSigned) {
      checkEligibility();
    }
  }, [isConnected, isSigned, checkEligibility, chain]);

  return { votingWeight, eligible, isSigned, signatureError, isConnected, address, checkEligibility };
};
