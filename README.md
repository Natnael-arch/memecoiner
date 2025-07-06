# 🪙 MemeCoiner

A decentralized application (dApp) for creating, minting, and trading meme coins on the Base network. Built with React, TypeScript, and Web3 technologies.

## 🌟 Features

- **Create Meme Coins**: Deploy your own ERC-20 meme tokens with custom names, symbols, and metadata
- **IPFS Integration**: Store token metadata and images on decentralized storage via Pinata
- **Base Network Support**: Deployed on Base Sepolia testnet (chain ID 84532)
- **Zora Integration**: Leverages Zora's coin creation infrastructure
- **Modern UI**: Beautiful, responsive interface with ConnectKit wallet integration


## 🏢 Sponsor Technology Integration

This project showcases several cutting-edge Web3 technologies from our sponsors:

### 🎨 **Zora** - Coin Creation Infrastructure
**Location**: `src/views/upload-page.tsx` (lines 7, 125-135), `src/hooks/useMemeCoins.ts` (lines 4, 8-35)
- **SDK**: `@zoralabs/coins-sdk`
- **Factory Contract**: `0x777777751622c0d3258f214F9DF38E35BF45baF3`
- **Usage**: 
  - Creates ERC-20 meme tokens on Base Sepolia
  - Provides on-chain coin details and pricing data
  - Handles token deployment and metadata management

### 🔗 **Alchemy** - Blockchain Infrastructure
**Location**: `web3provider.tsx` (lines 12-15), `src/hooks/useMemeCoins.ts` (line 95)
- **RPC Endpoint**: `https://base-sepolia.g.alchemy.com/v2/${VITE_ALCHEMY_ID}`
- **Usage**: Primary blockchain data provider for Base Sepolia testnet
- **Features**: Real-time block data, transaction monitoring, and event logging
- **Environment Variable**: `VITE_ALCHEMY_ID`

### 📌 **Pinata** - IPFS Storage & Pinning
**Location**: `src/views/upload-page.tsx` (lines 20-56, 108-120)
- **API Endpoints**: 
  - `https://api.pinata.cloud/pinning/pinFileToIPFS` (image uploads)
  - `https://api.pinata.cloud/pinning/pinJSONToIPFS` (metadata uploads)
- **Gateway**: `https://gateway.pinata.cloud/ipfs/`
- **Usage**: Stores meme images and metadata on IPFS with permanent pinning
- **Environment Variable**: `VITE_PINATA_JWT`



### 🔌 **ConnectKit** - Wallet Connection
**Location**: `web3provider.tsx` (lines 4, 30-45), `src/views/upload-page.tsx` (line 3), `src/views/landing-page.tsx` (line 3)
- **Package**: `connectkit`
- **Usage**: Seamless wallet connection for MetaMask, WalletConnect, and other Web3 wallets
- **Custom Theme**: Cyberpunk-inspired UI with gradient effects and custom styling
- **Environment Variable**: `VITE_WALLETCONNECT_PROJECT_ID`

### ⚡ **Wagmi & Viem** - Web3 Framework
**Location**: `web3provider.tsx` (lines 1-2), `src/hooks/useMemeCoins.ts` (lines 1-2), `src/views/upload-page.tsx` (lines 4-6)
- **Packages**: `wagmi`, `viem`
- **Usage**: 
  - Blockchain interaction layer
  - Contract reading and writing
  - Event logging and decoding
  - Transaction management
- **Features**: Type-safe blockchain interactions, automatic caching, and real-time updates

### 🏗️ **Base Network** - Ethereum L2
**Location**: `web3provider.tsx` (line 2), `src/hooks/useMemeCoins.ts` (line 2), `src/views/upload-page.tsx` (line 5)
- **Chain ID**: 84532 (Base Sepolia)
- **Usage**: Primary blockchain network for meme coin deployment and trading
- **Features**: Low gas fees, fast transactions, Ethereum L2 scaling solution

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MetaMask or any Web3 wallet
- Base Sepolia testnet configured in your wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd memecoiner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Alchemy API Key for Base Sepolia RPC
   VITE_ALCHEMY_ID=your_alchemy_api_key
   
   # WalletConnect Project ID for ConnectKit
   VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   
   # Pinata JWT for IPFS storage
   VITE_PINATA_JWT=your_pinata_jwt_token
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Sponsor | Required |
|----------|-------------|---------|----------|
| `VITE_ALCHEMY_ID` | Alchemy API key for Base Sepolia RPC | Alchemy | Yes |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID for ConnectKit | ConnectKit | Yes |
| `VITE_PINATA_JWT` | Pinata JWT token for IPFS storage | Pinata | Yes |

### Network Configuration

The dApp is configured to work exclusively on:
- **Base Sepolia Testnet** (Chain ID: 84532)
- **Alchemy RPC URL**: `https://base-sepolia.g.alchemy.com/v2/`

## 📱 Usage

### Creating a Meme Coin

1. **Connect your wallet** using the ConnectKit button
2. **Navigate to the Upload page** (`/upload`)
3. **Fill in token details**:
   - Token name
   - Upload token image (stored on IPFS via Pinata)
4. **Deploy your token** - this will create an ERC-20 contract on Base Sepolia via Zora

### Viewing Your Tokens

- **Landing page** (`/`) shows all created meme coins
- **Your tokens appear first** if you're connected with the wallet that created them
- **Real-time data** from Alchemy and Zora APIs

### Testing Your Token

After deployment, you can view your token on Zora's testnet explorer:
```
https://testnet.zora.co/coin/bsep:[your_token_address]
```

Replace `[your_token_address]` with your deployed token's contract address.

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: CSS + Tailwind CSS
- **Web3**: Wagmi + Viem + ConnectKit
- **Blockchain**: Base Sepolia (Ethereum L2)
- **Storage**: IPFS (via Pinata)
- **Token Creation**: Zora Coins SDK
- **RPC Provider**: Alchemy

### Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
│   └── useMemeCoins.ts # Core meme coin logic (Zora + Alchemy)
├── views/              # Page components
│   ├── landing-page.tsx
│   ├── upload-page.tsx # Pinata + Zora integration
│   └── not-found.tsx
├── assets/             # Static assets
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

### Key Components

- **Web3Provider**: Handles wallet connection (ConnectKit) and network configuration (Alchemy)
- **useMemeCoins**: Custom hook for fetching and managing meme coin data (Zora + Alchemy)
- **UploadPage**: Interface for creating new meme coins (Pinata + Zora)
- **LandingPage**: Display of all created meme coins

## 🔗 Smart Contracts

The dApp interacts with:
- **Zora Factory Contract**: `0x777777751622c0d3258f214F9DF38E35BF45baF3`
- **ERC-20 Tokens**: Standard ERC-20 contracts created through Zora
- **Base Sepolia Network**: Powered by Alchemy RPC

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel/Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your preferred hosting platform

## 🧪 Testing

### Local Development

```bash
npm run dev
```

### Linting

```bash
npm run lint
```

### Preview Build

```bash
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check that your wallet is connected to Base Sepolia testnet
2. Ensure you have sufficient testnet ETH for gas fees
3. Verify your environment variables are correctly set
4. Check the browser console for error messages

## 🔗 Links

### Sponsor Technologies
- [Alchemy Documentation](https://docs.alchemy.com/)
- [Pinata Documentation](https://docs.pinata.cloud/)
- [Zora Documentation](https://docs.zora.co/)
- [ConnectKit Documentation](https://docs.family.co/connectkit)
- [Wagmi Documentation](https://wagmi.sh/)
- [Base Documentation](https://docs.base.org/)

### Additional Resources
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
- [IPFS Documentation](https://docs.ipfs.io/)

---

**Happy meme coin creating! 🚀**

*This project proudly showcases the integration of cutting-edge Web3 technologies from our sponsors: Zora, Alchemy, Pinata,  ConnectKit, and Base Network.*
