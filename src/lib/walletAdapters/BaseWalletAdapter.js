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
}
