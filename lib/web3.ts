import { parseEther } from 'viem';
import { mainnet } from 'wagmi/chains';

export async function sendPayment(
  to: string,
  amount: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const value = parseEther(amount);

    // The actual payment logic will be handled by RainbowKit's ConnectButton
    // This is just a placeholder for now
    return { success: true };
  } catch (error) {
    console.error('Payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
} 