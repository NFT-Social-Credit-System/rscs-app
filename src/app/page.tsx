"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import UserTable from '../components/UserTable';
import AuthSuccessModal from '../components/AuthSuccessModal';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

/**
 * @author Ozzy(@Zerocousin)
 */

export default function Home() {
  const searchParams = useSearchParams();
  const auth = searchParams.get('auth');
  const error = searchParams.get('error');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    if (auth === 'success') {
      setModalMessage('Account successfully claimed!');
      setIsModalOpen(true);
    } else if (error) {
      setModalMessage(error);
      setIsModalOpen(true);
    }
  }, [auth, error]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="p-4 flex justify-end">
        <ConnectButton />
      </header>
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-black">Remilia Social Credit System</h1>
        <UserTable />
        <AuthSuccessModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          message={modalMessage}
        />
      </main>
    </div>
  );
}