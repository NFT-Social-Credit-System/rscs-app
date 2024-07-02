"use client";

import WalletConnect from '../components/walletConnect';
import UserTable from '../components/UserTable';
import AuthSuccessModal from '../components/AuthSuccessModal';
import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

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
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex flex-col bg-white">
        <header className="p-4 flex justify-end">
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
