
![Static Badge](https://img.shields.io/badge/Ethereum-blue)

![Static Badge](https://img.shields.io/badge/Solidity-8a2be2)

[![IPFS](https://img.shields.io/badge/IPFS-Enabled-blue.svg?style=flat-square&logo=ipfs)](https://ipfs.io/)
[![Module](https://img.shields.io/badge/Module-Verified-green.svg?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOSAxNi4xN0w0LjgzIDEyTDMuNDEgMTMuNDFMOSAxOUwyMSA3TDE5LjU5IDUuNTlMOSAxNi4xN1oiIGZpbGw9IndoaXRlIi8+PC9zdmc+)](https://explorer.aptoslabs.com/txn/0xfd71f336763eab3cec382344c3785a1bbaa5702738101ebb04b05de2b11ca5b1?network=testnet)

# InsureDApp - Decentralized Health Insurance Application 

This project implements a decentralized health insurance platform where users can:
- Buy Health Insurance Policies: Users can purchase health insurance policies directly on the blockchain.
- File Claims with Blockchain Records: Users can submit insurance claims that are securely recorded on the blockchain.
- Decentralized Document Storage: Claim-related documents are encrypted and stored on IPFS using Pinata for secure and tamper-proof storage.
- Smart Contract-Based Claim Processing: Claim approvals and payouts are automated using blockchain smart contracts.
- Admin Role for Claim Verification: The contract owner (admin) verifies claims and processes approvals or rejections.
- Claim Tracking: Users can track their submitted claims and receive updates on their status in real time.
- Secure and Transparent Transactions: All transactions, policy details, and claim processes are immutably recorded on the blockchain.

### Etherscan Link to see contract transaction: https://sepolia.etherscan.io/address/0xC71340701FD98Be032D56C7D76a662415a70fc24

## Technologies Used
### Blockchain & Smart Contracts

- Ethereum Blockchain
- Solidity Programming Language
- Sepolia SDK

### Frontend

- React.js with TypeScript
- MetaMask Wallet Integration

### Storage

- IPFS (InterPlanetary File System)
- Pinata IPFS Pinning Service

### Development Tools

- Vite
- Node.js
- npm

## Features

- 🔐 Client-side AES encryption
- 📁 Decentralized file storage on IPFS
- 🔗 Blockchain-based access control
- 👥 owner-to-customer policy transaction
- 🎯 Granular access management
- 📱 Responsive web interface

## Getting Started
- Node.js (v14 or later)
- npm
- MetaMask Wallet Browser Extension

### Installation

1. Clone the repository
```
git clone https://github.com/amanpandey2587/InsureDApp.git
cd InsureDApp
```

2. Install dependencies for both contracts and frontend
```
# Install Move dependencies
cd contracts
yarn add OR npm install

Set up environment variables
```

```
RPC_URL =YOUR_RPC_URL
VITE_PINATA_SECRET_KEY=SEPOLIA_WALLET_ACCOUNT_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_EMAILJS_SERVICE_ID

```
```
# Install frontend dependencies
cd ..
npm install
```

3. Set up environment variables
```
VITE_OWNER_ADDRESS =CONTRACT_OWNER_ADDRESS
VITE_CONTRACT_ADDRESS =CONTRACT_ADDRESS
VITE_PINATA_API_Key=YOUR_PINATA_API_KEY
vITE_API_SECRET=YOUR_PINATA_API_SECRET
VITE_GATEWAY_URL=YOUR_PINATA_GATEWAY_URL
VITE_JWT=YOUR_PINATA_JWT_ADDRESS
VITE_EMAILJS_SERVICE_ID=YOUR_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID=YOUR_EMAILJS_TEMPLATE_ID
VITE_EMAILJS_USER_ID=YOUR_EMAILJS_USER_ID

```

### Configuration

4. Deploy smart contracts
```
cd contracts
yarn hardhat deploy --network sepolia
```

5. Start the frontend application
```
cd ..
npm run dev
```



### Security Considerations

- All files are encrypted client-side before uploading
- Encryption keys never leave the user's browser
- Smart contract handles access control
- Wallet signatures required for all transactions

### Deployed Project Link

- https://insuredapp.netlify.app/
