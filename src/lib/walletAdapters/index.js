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
  console.log(`🏭 Creating wallet adapter for: ${walletType}`);
  
  switch (walletType) {
    case SUPPORTED_WALLETS.TRUST_WALLET:
      console.log('📱 Creating TrustWallet adapter');
      return new TrustWalletAdapter();
    case SUPPORTED_WALLETS.METAMASK:
      console.log('🦊 Creating MetaMask adapter');
      return new MetaMaskAdapter();
    case SUPPORTED_WALLETS.PHANTOM:
      console.log('👻 Creating Phantom adapter');
      return new PhantomAdapter();
    case SUPPORTED_WALLETS.COINBASE:
      console.log('🔵 Creating Coinbase Wallet adapter');
      return new CoinbaseWalletAdapter();
    case SUPPORTED_WALLETS.TOKEN_POCKET:
      console.log('💼 Creating TokenPocket adapter');
      return new TokenPocketAdapter();
    default:
      console.error(`❌ Unsupported wallet type: ${walletType}`);
      throw new Error(`Unsupported wallet type: ${walletType}`);
  }
}

/**
 * Get all available wallet adapters
 * @returns {Array<BaseWalletAdapter>} - Array of available wallet adapters
 */
export function getAvailableWallets() {
  const wallets = [];
  
  // Check wallets in priority order (most specific first)
  const walletClasses = [
    TokenPocketAdapter,    // Check TokenPocket first as it might set multiple flags
    TrustWalletAdapter,    // Then TrustWallet
    CoinbaseWalletAdapter, // Then Coinbase
    PhantomAdapter,        // Then Phantom (Solana)
    MetaMaskAdapter        // MetaMask last as it's most generic
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

/**
 * Debug function to log wallet detection details
 */
export function debugWalletDetection() {
  console.log('🔍 Wallet Detection Debug:');
  console.log('window.ethereum:', window.ethereum);
  
  if (window.ethereum) {
    console.log('ethereum.isMetaMask:', window.ethereum.isMetaMask);
    console.log('ethereum.isTrust:', window.ethereum.isTrust);
    console.log('ethereum.isTrustWallet:', window.ethereum.isTrustWallet);
    console.log('ethereum.isTokenPocket:', window.ethereum.isTokenPocket);
    console.log('ethereum.isCoinbaseWallet:', window.ethereum.isCoinbaseWallet);
    console.log('ethereum.isTP:', window.ethereum.isTP);
  }
  
  console.log('window.phantom:', window.phantom);
  console.log('window.tokenpocket:', window.tokenpocket);
  console.log('window.coinbaseWalletExtension:', window.coinbaseWalletExtension);
  
  console.log('\n🎯 Available Wallets:');
  getAllWallets().forEach(wallet => {
    console.log(`${wallet.name}: ${wallet.isAvailable() ? '✅ Available' : '❌ Not Available'}`);
  });
}
