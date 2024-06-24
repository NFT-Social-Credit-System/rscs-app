"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';


/**
 * @author Ozzy(@Zerocousin) for Remilia Social Credit System
 */


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="p-4 flex justify-end">
        <ConnectButton />
      </header>
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-black">Remilia Social Credit System</h1>
      </main>
    </div>
  );
}
