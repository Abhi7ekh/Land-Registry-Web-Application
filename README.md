# 🏛️ Advanced Land Registry DApp

A decentralized land registry application built with React, Solidity, and Hardhat. This DApp allows users to register, transfer, and manage land ownership on the blockchain with advanced features like verification, admin controls, and transfer history.

## ✨ Features

### 🏡 Land Management
- **Register New Lands**: Add land properties with location, area, and price
- **Transfer Ownership**: Securely transfer land between addresses
- **View Land Details**: Complete land information with verification status
- **Land History**: Track all ownership transfers and changes

### 🔐 Admin Features
- **Land Verification**: Admins can verify land registrations
- **Admin Management**: Add/remove admin addresses
- **Statistics Dashboard**: View total lands and verification rates
- **Complete Land Overview**: See all registered lands in the system

### 🛡️ Security & Validation
- **Ownership Verification**: Only land owners can transfer their properties
- **Admin Controls**: Role-based access for verification and management
- **Input Validation**: Comprehensive validation for all user inputs
- **Transfer History**: Immutable record of all land transfers

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd land-registry-dapp
   ```

2. **Install dependencies**
   ```bash
   # Install smart contract dependencies
   cd smart-contract
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Deploy the smart contract**
   ```bash
   cd ../smart-contract
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network <your-network>
   ```

4. **Update contract address**
   - Copy the deployed contract address
   - Update `client/src/services/contract.js` with the new address

5. **Start the frontend**
   ```bash
   cd ../client
   npm run dev
   ```

## 📁 Project Structure

```
land-registry-dapp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   └── services/      # Contract interaction
├── smart-contract/         # Solidity smart contracts
│   ├── contracts/         # Smart contract source
│   ├── scripts/           # Deployment scripts
│   └── artifacts/         # Compiled contracts
└── scripts/               # Utility scripts
```

## 🏗️ Smart Contract Features

### Core Functions
- `registerLand()`: Register new land properties
- `transferLand()`: Transfer land ownership
- `verifyLand()`: Admin function to verify lands
- `getAllLands()`: Get all registered lands
- `getLandTransferHistory()`: Get transfer history for a land

### Admin Functions
- `addAdmin()`: Add new admin addresses
- `removeAdmin()`: Remove admin addresses
- `isAdmin()`: Check if address is admin
- `getLandStats()`: Get system statistics

### Data Structures
- **Land**: Complete land information with verification status
- **TransferHistory**: Record of ownership transfers
- **Admin Management**: Role-based access control

## 🎨 Frontend Features

### Pages
- **Admin Dashboard**: Overview with statistics and recent lands
- **Register Land**: Form to register new land properties
- **View Lands**: Display user's owned lands
- **Transfer Land**: Transfer ownership to another address
- **Land History**: View detailed land information and transfer history

### Components
- **Navbar**: Navigation between pages
- **Toast Notifications**: User feedback for all actions
- **Loading States**: Smooth user experience
- **Responsive Design**: Works on all device sizes

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the smart-contract directory:
```env
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
ALCHEMY_API_KEY=your_alchemy_api_key
```

### Network Configuration
Update `hardhat.config.js` with your preferred network:
```javascript
module.exports = {
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY]
    }
  }
};
```

## 🧪 Testing

### Smart Contract Tests
```bash
cd smart-contract
npx hardhat test
```

### Frontend Tests
```bash
cd client
npm test
```

## 📊 Usage Guide

### For Land Owners
1. **Connect MetaMask** to the application
2. **Register Land** with location, area, and price
3. **View Your Lands** in the dashboard
4. **Transfer Ownership** to other addresses
5. **Check History** of your land transfers

### For Admins
1. **Access Admin Dashboard** with admin privileges
2. **Verify Lands** that meet requirements
3. **Monitor Statistics** of the system
4. **Manage Admin Roles** as needed

## 🔒 Security Considerations

- **Private Key Management**: Never expose private keys
- **Address Validation**: Always validate Ethereum addresses
- **Transaction Confirmation**: Wait for blockchain confirmations
- **Admin Access**: Limit admin privileges to trusted addresses

## 🚨 Troubleshooting

### Common Issues
1. **MetaMask Not Connected**: Ensure MetaMask is installed and connected
2. **Transaction Fails**: Check gas fees and network connection
3. **Contract Not Found**: Verify contract address is correct
4. **ABI Mismatch**: Recompile and redeploy contract

### Debug Commands
```bash
# Check contract deployment
npx hardhat run scripts/deploy.js --network localhost

# Verify contract
npx hardhat verify --network sepolia <contract-address>

# Check contract state
npx hardhat console --network sepolia
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Hardhat for development framework
- Ethers.js for blockchain interaction
- React for frontend framework
- Tailwind CSS for styling

---

**Built with ❤️ for the blockchain community**
