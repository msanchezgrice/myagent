'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

// Check if the project ID is available
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!projectId) {
  console.error('WalletConnect project ID is not configured');
}

const config = getDefaultConfig({
  appName: 'My Agent',
  projectId: projectId || '', // Provide empty string as fallback
  chains: [mainnet],
  ssr: true, // Enable server-side rendering
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  if (!projectId) {
    // Render children without wallet functionality if project ID is missing
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 