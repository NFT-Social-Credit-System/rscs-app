"use client";

import WalletConnect from '../components/walletConnect';
import UserTable from '../components/UserTable';
import AuthSuccessModal from '../components/AuthSuccessModal';
import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { CommandLineIcon, BanknotesIcon } from '@heroicons/react/24/solid';
import '../app/globals.css';

function SearchParamsHandler() {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const authStatus = searchParams.get('auth');
    const error = searchParams.get('error');

    if (authStatus === 'success') {
      setIsModalOpen(true);
      setModalMessage('Authentication successful!');
    } else if (error) {
      setIsModalOpen(true);
      setModalMessage(`Error: ${error}`);
    }
  }, [searchParams]);

  return (
    <AuthSuccessModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      message={modalMessage}
    />
  );
}

export default function Home() {
  const [isGithubPopoverOpen, setIsGithubPopoverOpen] = useState(false);
  const [isDonationPopoverOpen, setIsDonationPopoverOpen] = useState(false);
  const [donationCopied, setDonationCopied] = useState(false);

  const handleDonationClick = () => {
    navigator.clipboard.writeText("0x7db8c599CE6d0a2aBD64CB2D5A77234c17C62608");
    setDonationCopied(true);
    setIsDonationPopoverOpen(true); // Keep the popover open
    setTimeout(() => {
      setDonationCopied(false);
      setIsDonationPopoverOpen(false);
    }, 2000);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex flex-col bg-white">
        <header className="p-4 flex justify-between items-center">
          <div className="flex flex-col space-y-2">
            <Popover 
              placement="right" 
              showArrow={true} 
              offset={10}
              isOpen={isGithubPopoverOpen}
              onOpenChange={(open) => setIsGithubPopoverOpen(open)}
            >
              <PopoverTrigger>
                <Button
                  as="a"
                  href="https://github.com/Remilia-Social-Credit-System"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="default"
                  className="w-12 h-12 min-w-0 p-0 bg-gray-100 hover:bg-gray-200"
                  onMouseEnter={() => setIsGithubPopoverOpen(true)}
                  onMouseLeave={() => setIsGithubPopoverOpen(false)}
                >
                  <CommandLineIcon className="h-6 w-6 text-gray-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2">
                  <div className="text-small font-bold">Source Code</div>
                </div>
              </PopoverContent>
            </Popover>
            <Popover 
              placement="right" 
              showArrow={true} 
              offset={10}
              isOpen={isDonationPopoverOpen}
              onOpenChange={(open) => setIsDonationPopoverOpen(open)}
            >
              <PopoverTrigger>
                <Button
                  color="success"
                  className="w-12 h-12 min-w-0 p-0 bg-green-100 hover:bg-green-200"
                  onClick={handleDonationClick}
                  onMouseEnter={() => setIsDonationPopoverOpen(true)}
                  onMouseLeave={() => !donationCopied && setIsDonationPopoverOpen(false)}
                >
                  <BanknotesIcon className="h-6 w-6 text-green-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2">
                  <div className="text-small font-bold">
                    {donationCopied ? "Copied to Clipboard!" : "Donation"}
                  </div>
                  <div className="text-small">
                    {donationCopied ? "" : "Click to copy wallet address"}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <WalletConnect />
        </header>
        <main className="flex-grow flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <Image
              src="/remilia.png"
              alt="Remilia logo"
              width={100}
              height={100}
            />
          </div>
          <h1 className="text-3xl font-bold text-black">Remilia Social Credit System</h1>
          <UserTable />
          <SearchParamsHandler />
        </main>
      </div>
    </Suspense>
  );
}
