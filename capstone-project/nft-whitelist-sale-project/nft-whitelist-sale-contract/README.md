# NFT Whitelist Sale

A smart contract implementation for a whitelisted NFT sale with Ethereum.

## Overview

This project implements an ERC721 NFT collection with a whitelist mechanism, allowing only approved addresses to mint tokens. The contract includes features such as:

- Whitelist management by the owner
- Limited minting per wallet address
- Maximum supply cap
- ETH withdrawal functionality for the contract owner

## Contract Details

- **Name**: NFTWhitelistSale
- **Symbol**: NFTWS
- **Price**: 0.000001 ETH per NFT
- **Max Supply**: 50 NFTs
- **Max Per Wallet**: 2 NFTs

## Tech Stack

- Solidity (^0.8.0)
- Hardhat
- TypeScript
- OpenZeppelin Contracts
- Ethers.js

## Smart Contract Features

### Whitelist Management
- `addToWhitelist(address user)`: Add an address to the whitelist (owner only)
- `isWhitelisted(address _address)`: Check if an address is whitelisted

### Minting
- `mint(uint256 amount)`: Mint specified number of NFTs (only for whitelisted addresses)

### Administration
- `withdraw()`: Withdraw all ETH from the contract to the owner

## Development

### Prerequisites
- Node.js
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd nft-whitelist-sale
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file with the following variables:
   ```
   TESTNET_PRIVATE_KEY=your_private_key
   MAINNET_PRIVATE_KEY=your_private_key
   ETHERSCAN_API=your_etherscan_api_key
   ```

### Testing

Run the test suite:
```bash
npx hardhat test
```

<img src="https://res.cloudinary.com/dkepitcb7/image/upload/v1753153493/test-nft-whitelist-sale_sqgxk4.png" width=500>

### Deployment

Deploy to Sepolia testnet:
```bash
npx hardhat deploy --network sepolia --tag deploy
```

Verify contract:
```bash
npx hardhat run scripts/verify-contract.ts --network sepolia
```

Deploy to Ethereum mainnet:
```bash
npx hardhat deploy --network mainet
```

### Sample TX demo:
```
- contract verify: https://sepolia.etherscan.io/address/0x5FA79A974c1dC9a1b6CC88c1CfaaD20935c02287#readContract

- addToWhitelist: https://sepolia.etherscan.io/tx/0x1df5d16d651951cb896a24c640396889691e6e17de15ebea84fea0febbefe81e
- Insufficient payment: https://sepolia.etherscan.io/tx/0x79d0f28977faaebaaccb381c1733610560a030eb37f47e947294875a0dc30e8f
- Mint Success: https://sepolia.etherscan.io/tx/0xd4995c9ed342d35a9a29a9578051cf1438acd460ab891026e3ab8c5a0f6661bb
- Exceeds max supply: https://sepolia.etherscan.io/tx/0x702d7facd622adfdf90c7b2cdee21d0163beb471722971c589b595d5d186cbaf
- Not whitelisted: https://sepolia.etherscan.io/tx/0xb083334ce85c66e43b6dde5eafc1dcb5e7ae3f4ab69f08597a2aeaa03f735d4e
- Withdraw ETH: https://sepolia.etherscan.io/tx/0x26f2db5036eb8a126022f562ee0405a1f5e088c62f69d6f4b1959674e548dee2
```

Lastest contract: 0xb2e1832AD523F5ffC43BED3B9052E8d498F49BA9
## License

MIT