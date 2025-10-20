/**
 * Base class for all wallet adapters
 * This provides a common interface that all wallet adapters must implement
 */
export class BaseWalletAdapter {
  constructor(name, icon) {
    this.name = name;
    this.icon = icon;
    this.connected = false;
    this.address = null;
    this.provider = null;
  }

  /**
   * Check if the wallet is available/installed
   * @returns {boolean}
   */
  isAvailable() {
    throw new Error('isAvailable method must be implemented');
  }

  /**
   * Connect to the wallet
   * @returns {Promise<{address: string, provider: any}>}
   */
  async connect() {
    throw new Error('connect method must be implemented');
  }

  /**
   * Disconnect from the wallet
   * @returns {Promise<void>}
   */
  async disconnect() {
    this.connected = false;
    this.address = null;
    this.provider = null;
  }

  /**
   * Get wallet balance
   * @returns {Promise<string>}
   */
  async getBalance() {
    throw new Error('getBalance method must be implemented');
  }

  /**
   * Get balance for a specific token/currency
   * @param {string} tokenAddress - Token contract address (for ERC-20 tokens)
   * @param {string} symbol - Token symbol
   * @returns {Promise<string>}
   */
  async getTokenBalance(tokenAddress, symbol) {
    // Default implementation - can be overridden by specific adapters
    if (symbol === 'ETH' || symbol === 'BNB' || symbol === 'MATIC' || symbol === 'AVAX' || symbol === 'FTM' || symbol === 'SOL') {
      return await this.getBalance(); // Native token balance
    }
    return '0'; // Default for tokens not implemented
  }

  /**
   * Get all available balances for supported currencies
   * @returns {Promise<Array<{symbol: string, name: string, balance: string, network: string}>>}
   */
  async getAllBalances() {
    if (!this.connected || !this.provider || !this.address) {
      throw new Error('Wallet not connected');
    }

    const currencies = this.getSupportedCurrencies();
    const balances = [];

    console.log(`💰 Fetching balances for ${currencies.length} currencies...`);

    for (const currency of currencies) {
      try {
        let balance = '0';
        
        // Get native token balance for primary currencies
        if (this.isPrimaryCurrency(currency.symbol)) {
          balance = await this.getBalance();
        } else {
          // For other tokens, try to get token balance
          balance = await this.getTokenBalance(this.getTokenAddress(currency.symbol), currency.symbol);
        }

        balances.push({
          symbol: currency.symbol,
          name: currency.name,
          balance: balance,
          network: currency.network
        });

        console.log(`${currency.symbol} (${currency.name}): ${balance} on ${currency.network}`);
      } catch (error) {
        console.warn(`Failed to fetch balance for ${currency.symbol}:`, error.message);
        balances.push({
          symbol: currency.symbol,
          name: currency.name,
          balance: 'Error',
          network: currency.network
        });
      }
    }

    return balances;
  }

  /**
   * Check if a currency is the primary/native currency for this wallet
   * @param {string} symbol - Currency symbol
   * @returns {boolean}
   */
  isPrimaryCurrency(symbol) {
    const primaryCurrencies = ['ETH', 'BNB', 'MATIC', 'AVAX', 'FTM', 'SOL', 'TRX', 'HT'];
    return primaryCurrencies.includes(symbol);
  }

  /**
   * Get token contract address for a given symbol
   * @param {string} symbol - Token symbol
   * @returns {string} - Contract address
   */
  getTokenAddress(symbol) {
    // Common token addresses (Ethereum mainnet)
    const tokenAddresses = {
      'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      'USDC': '0xA0b86a33E6441b8C0b7b2e0b1b4b8b8b8b8b8b8b',
      'DAI': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      'WETH': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      'UNI': '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      'LINK': '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      'COMP': '0xc00e94Cb662C3520282E6f5717214004A7f26888'
    };
    return tokenAddresses[symbol] || '';
  }

  /**
   * Send transaction
   * @param {Object} transaction - Transaction object
   * @returns {Promise<string>} - Transaction hash
   */
  async sendTransaction(transaction) {
    throw new Error('sendTransaction method must be implemented');
  }

  /**
   * Sign message
   * @param {string} message - Message to sign
   * @returns {Promise<string>} - Signed message
   */
  async signMessage(message) {
    throw new Error('signMessage method must be implemented');
  }

  /**
   * Get network information
   * @returns {Promise<Object>}
   */
  async getNetwork() {
    throw new Error('getNetwork method must be implemented');
  }

  /**
   * Get supported currencies/tokens for this wallet
   * @returns {Array<Object>} - Array of supported currencies
   */
  getSupportedCurrencies() {
    // Default implementation - can be overridden by specific adapters
    return [
      { symbol: 'ETH', name: 'Ethereum', network: 'Ethereum' },
      { symbol: 'BTC', name: 'Bitcoin', network: 'Bitcoin' },
      { symbol: 'USDT', name: 'Tether', network: 'Multi-chain' },
      { symbol: 'USDC', name: 'USD Coin', network: 'Multi-chain' },
      { symbol: 'BNB', name: 'Binance Coin', network: 'BSC' }
    ];
  }

  /**
   * Log wallet connection details
   */
  async logConnectionDetails() {
    console.log(`🔗 ${this.name} Connected Successfully!`);
    console.log(`📍 Address: ${this.address}`);
    console.log(`💰 Supported Currencies:`, this.getSupportedCurrencies());
    console.log(`🌐 Wallet Provider:`, this.provider);
    
    // Fetch and display all available balances
    try {
      console.log(`\n💳 Fetching all available balances for ${this.name}...`);
      const balances = await this.getAllBalances();
      
      console.log(`\n📊 ${this.name} Balance Summary:`);
      console.table(balances);
      
      // Also log in a more readable format
      console.log(`\n💰 Detailed Balance Information:`);
      balances.forEach(balance => {
        if (balance.balance !== '0' && balance.balance !== 'Error') {
          console.log(`✅ ${balance.symbol}: ${balance.balance} (${balance.name} on ${balance.network})`);
        } else if (balance.balance === 'Error') {
          console.log(`❌ ${balance.symbol}: Failed to fetch (${balance.name} on ${balance.network})`);
        } else {
          console.log(`⚪ ${balance.symbol}: 0 (${balance.name} on ${balance.network})`);
        }
      });
    } catch (error) {
      console.error(`❌ Failed to fetch balances for ${this.name}:`, error);
    }
  }
}
