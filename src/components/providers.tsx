"use client";

import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';
import { NextUIProvider } from "@nextui-org/react";

/**
 * 
 * @author Ozzy(@Zerocousin) for Remilia Social Credit System
 * 
 */

// Configure the Ethereum chain and provider
const { chains, publicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

// Set up wallets with RainbowKit
const { connectors } = getDefaultWallets({
  appName: 'Remilia Social Credit System',
  projectId: '85qkfckoqpunjx7q', // WalletConnect ID from Alchemy
  chains
});

// Create Wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

// Wrap the app with necessary providers
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
