"use client";

import React from 'react';
import { Providers } from '../components/providers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/rainbowKit'
import { WagmiConfig } from 'wagmi'
import './globals.css'

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig config={config}>
          <QueryClientProvider client={queryClient}>
            <Providers>{children}</Providers>
          </QueryClientProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
