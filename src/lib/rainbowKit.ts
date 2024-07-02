import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { http, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { createPublicClient } from 'viem';

const { connectors } = getDefaultWallets({
  appName: 'RSCS',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
});

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
});

const config = createConfig({
  chains: [mainnet],
  connectors,
  transports: {
    [mainnet.id]: http(),
  },
});

export { config };
