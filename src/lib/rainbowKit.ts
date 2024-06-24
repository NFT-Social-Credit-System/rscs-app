import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

/**
 * @author Ozzy(@Zerocousin) for Remilia Social Credit System
 * RainbowKit is a library that provides a UI for connecting and managing wallets.
 * 
 */

const { chains, publicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'RSCS',
  projectId: 'YOUR_PROJECT_ID', // We need to replace the WalletConnect Cloud Project ID here @ToDo
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

export { RainbowKitProvider, chains, wagmiConfig };

