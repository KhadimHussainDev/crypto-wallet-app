# Crypto Wallet Connection App

A modern, extensible React application for connecting to multiple cryptocurrency wallets. Supports TrustWallet, MetaMask, Phantom, Coinbase Wallet, and TokenPocket with a modular architecture designed for easy expansion.

## Features

- 🔗 **Multi-Wallet Support**: Supports 5 major cryptocurrency wallets
- 💰 **Balance Display**: Real-time wallet balance checking
- 🔄 **Transaction Support**: Send transactions with user approval
- ✍️ **Message Signing**: Sign messages securely
- 🌐 **Network Detection**: Automatic network detection and switching
- 🎨 **Modern UI**: Beautiful, responsive design with TailwindCSS
- 🔧 **Extensible Architecture**: Easy to add new wallet adapters

## Supported Wallets

### Currently Available
- ✅ **TrustWallet** - Ethereum, BSC, and multi-chain support
- ✅ **MetaMask** - Most popular Ethereum wallet with multi-chain support
- ✅ **Phantom** - Solana ecosystem wallet with SOL support
- ✅ **Coinbase Wallet** - User-friendly Ethereum wallet
- ✅ **TokenPocket** - Multi-chain wallet with extensive network support

## Installation

1. **Install dependencies**:
   ```bash
   cd crypto-wallet-app
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Usage

### Connecting a Wallet

1. **Install Your Preferred Wallet**: Make sure you have one of the supported wallet extensions installed:
   - TrustWallet Browser Extension
   - MetaMask Browser Extension  
   - Phantom Browser Extension
   - Coinbase Wallet Extension
   - TokenPocket Browser Extension
2. **Click Connect**: Click on your wallet card in the interface
3. **Approve Connection**: Approve the connection request in your wallet
4. **Start Using**: Once connected, you can view balance and send transactions

### Sending Transactions

1. **Connect your wallet** first
2. **Click "Send Transaction"** button
3. **Fill in the details**:
   - Recipient address
   - Amount in ETH
   - Gas limit (optional, defaults to 21000)
4. **Submit** and approve in your wallet

### Signing Messages

1. **Connect your wallet** first
2. **Click "Sign Message"** button
3. **Enter your message**
4. **Submit** and approve in your wallet

## Architecture

### Wallet Adapter Pattern

The application uses a modular wallet adapter pattern that makes it easy to add new wallets:

```
src/lib/walletAdapters/
├── BaseWalletAdapter.js        # Abstract base class
├── TrustWalletAdapter.js       # TrustWallet implementation
├── MetaMaskAdapter.js          # MetaMask implementation
├── PhantomAdapter.js           # Phantom implementation
├── CoinbaseWalletAdapter.js    # Coinbase Wallet implementation
├── TokenPocketAdapter.js       # TokenPocket implementation
└── index.js                    # Wallet registry and factory
```

### Adding New Wallets

To add a new wallet:

1. **Create a new adapter** extending `BaseWalletAdapter`
2. **Implement required methods**: `connect()`, `disconnect()`, `getBalance()`, etc.
3. **Register in the factory** in `index.js`
4. **Add to supported wallets** enum

Example:
```javascript
// MetaMaskAdapter.js
import { BaseWalletAdapter } from './BaseWalletAdapter.js';

export class MetaMaskAdapter extends BaseWalletAdapter {
  constructor() {
    super('MetaMask', '/icons/metamask.svg');
  }
  
  isAvailable() {
    return window.ethereum && window.ethereum.isMetaMask;
  }
  
  // Implement other required methods...
}
```

## Technical Stack

- **React 18**: Modern React with hooks and context
- **Ethers.js**: Ethereum blockchain interaction
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons
- **Vite**: Fast build tool and development server

## Configuration

### Environment Variables

Create a `.env` file for any environment-specific configuration:

```env
# Add any API keys or configuration here
VITE_INFURA_PROJECT_ID=your_infura_project_id
VITE_ALCHEMY_API_KEY=your_alchemy_api_key
```

### Network Configuration

The app currently defaults to Ethereum mainnet. You can modify network settings in the wallet adapters or add network switching functionality.

## Security Considerations

- **Never store private keys**: The app only connects to wallets, never handles private keys
- **User approval required**: All transactions require explicit user approval in the wallet
- **Secure connections**: Uses HTTPS and secure wallet connection protocols
- **Input validation**: All user inputs are validated before processing

## Development

### Project Structure

```
src/
├── components/           # React components
│   ├── WalletCard.jsx   # Individual wallet display
│   ├── WalletInfo.jsx   # Connected wallet information
│   └── WalletConnection.jsx # Main connection interface
├── contexts/            # React contexts
│   └── WalletContext.jsx # Wallet state management
├── lib/                 # Utilities and adapters
│   └── walletAdapters/  # Wallet adapter implementations
├── App.jsx              # Main app component
├── main.jsx            # React entry point
└── index.css           # Global styles
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## Troubleshooting

### Common Issues

1. **"Wallet not detected"**: Make sure the wallet extension is installed and enabled
2. **Connection fails**: Try refreshing the page and ensuring the wallet is unlocked
3. **Transaction fails**: Check that you have sufficient balance and gas

### Browser Compatibility

- Chrome/Chromium-based browsers (recommended)
- Firefox (with wallet extensions)
- Safari (limited wallet support)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your wallet adapter following the existing pattern
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this code for your own projects!

## Support

For issues and questions:
- Check the troubleshooting section
- Review wallet extension documentation
- Open an issue on GitHub
