import { TrustWalletAdapter } from './TrustWalletAdapter.js';
import { MetaMaskAdapter } from './MetaMaskAdapter.js';
import { PhantomAdapter } from './PhantomAdapter.js';
import { CoinbaseWalletAdapter } from './CoinbaseWalletAdapter.js';
import { TokenPocketAdapter } from './TokenPocketAdapter.js';

// Export all wallet adapters
export { BaseWalletAdapter } from './BaseWalletAdapter.js';
export { TrustWalletAdapter } from './TrustWalletAdapter.js';
export { MetaMaskAdapter } from './MetaMaskAdapter.js';
export { PhantomAdapter } from './PhantomAdapter.js';
export { CoinbaseWalletAdapter } from './CoinbaseWalletAdapter.js';
export { TokenPocketAdapter } from './TokenPocketAdapter.js';

// Wallet registry - all supported wallets
export const SUPPORTED_WALLETS = {
  TRUST_WALLET: 'trustwallet',
  METAMASK: 'metamask',
  PHANTOM: 'phantom',
  COINBASE: 'coinbase',
  TOKEN_POCKET: 'tokenpocket'
};

/**
 * Factory function to create wallet adapters
 * @param {string} walletType - Type of wallet to create
 * @returns {BaseWalletAdapter} - Wallet adapter instance
 */
export function createWalletAdapter(walletType) {
  switch (walletType) {
    case SUPPORTED_WALLETS.TRUST_WALLET:
      return new TrustWalletAdapter();
    case SUPPORTED_WALLETS.METAMASK:
      return new MetaMaskAdapter();
    case SUPPORTED_WALLETS.PHANTOM:
      return new PhantomAdapter();
    case SUPPORTED_WALLETS.COINBASE:
      return new CoinbaseWalletAdapter();
    case SUPPORTED_WALLETS.TOKEN_POCKET:
      return new TokenPocketAdapter();
    default:
      throw new Error(`Unsupported wallet type: ${walletType}`);
  }
}

/**
 * Get all available wallet adapters
 * @returns {Array<BaseWalletAdapter>} - Array of available wallet adapters
 */
export function getAvailableWallets() {
  const wallets = [];
  
  // Check all wallets
  const walletClasses = [
    TrustWalletAdapter,
    MetaMaskAdapter,
    PhantomAdapter,
    CoinbaseWalletAdapter,
    TokenPocketAdapter
  ];
  
  walletClasses.forEach(WalletClass => {
    const wallet = new WalletClass();
    if (wallet.isAvailable()) {
      wallets.push(wallet);
    }
  });
  
  return wallets;
}

/**
 * Get all wallet adapters (including unavailable ones for display)
 * @returns {Array<BaseWalletAdapter>} - Array of all wallet adapters
 */
export function getAllWallets() {
  return [
    new TrustWalletAdapter(),
    new MetaMaskAdapter(),
    new PhantomAdapter(),
    new CoinbaseWalletAdapter(),
    new TokenPocketAdapter()
  ];
}
