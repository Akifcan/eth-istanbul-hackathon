# Sway - Group Buying Platform

Sway is a decentralized group buying platform that enables users to collectively purchase products at discounted prices through smart contracts. The platform connects buyers, sellers, and companies to create bulk purchasing opportunities with blockchain-based transparency and security.

## 🚀 Features

- **Group Buying Campaigns**: Create and join campaigns to purchase products collectively
- **Smart Contract Integration**: Ethereum-based smart contracts for secure transactions
- **Seller Management**: Corporate sellers can create offers and manage their products
- **Real-time Pricing**: Dynamic pricing based on group participation
- **Secure Authentication**: JWT-based authentication for users and sellers
- **Responsive Design**: Modern UI built with Next.js and Tailwind CSS

## 🏗️ Architecture

The project consists of three main components:

### Frontend (`/frontend`)
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Blockchain Integration**: Ethers.js
- **HTTP Client**: Axios with React Query

### Backend (`/backend`)
- **Framework**: NestJS
- **Database**: MySQL with TypeORM
- **Authentication**: JWT with bcrypt
- **Security**: Helmet, CORS, Rate Limiting

### Smart Contracts (`/app-contracts`)
- **Framework**: Hardhat
- **Language**: Solidity
- **Network**: Ethereum-compatible

## 📦 Key Components

### Smart Contract Features
- **Campaign Creation**: Create group buying campaigns with participant limits
- **Offer Management**: Sellers can submit offers for products
- **Automatic Finalization**: Campaigns auto-finalize after 7 days
- **Deposit Management**: Secure handling of participant deposits
- **Price Calculation**: Dynamic pricing based on group size

### Database Entities
- **Campaigns**: Track group buying campaigns and blockchain transactions
- **Sellers**: Manage corporate seller accounts and authentication
- **Offers**: Store product offers linked to campaigns and sellers

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MySQL database
- Ethereum wallet (MetaMask recommended)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
# Configure database connection in .env
npm run start:dev
```

### Smart Contracts Setup
```bash
cd app-contracts
npm install
npx hardhat compile
npx hardhat test
```

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=Sway
JWT_SECRET=your_jwt_secret
PASSWORD_SALT_ROUND=10
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Sway-app
   ```

2. **Set up the database**
   - Create a MySQL database
   - Update the database configuration in backend/.env

3. **Deploy smart contracts**
   ```bash
   cd app-contracts
   npx hardhat run scripts/deploy.js --network localhost
   ```

4. **Start the backend**
   ```bash
   cd backend
   npm run start:dev
   ```

5. **Start the frontend**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📱 Usage

### For Regular Users
1. Connect your wallet
2. Browse available campaigns
3. Join campaigns by depositing funds
4. Wait for campaign finalization
5. Receive products or refunds

### For Corporate Sellers
1. Register as a seller
2. Create product offers
3. Monitor campaign progress
4. Fulfill orders when campaigns finalize

## 🔒 Security Features

- **Smart Contract Security**: Audited Solidity contracts with proper access controls
- **Authentication**: JWT-based authentication with password hashing
- **Input Validation**: Comprehensive validation using class-validator
- **Rate Limiting**: Protection against abuse and spam
- **CORS Protection**: Secure cross-origin resource sharing

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
npm run test:e2e
```

### Smart Contract Tests
```bash
cd app-contracts
npx hardhat test
```

## 📄 API Documentation

The backend provides RESTful APIs for:
- User authentication and registration
- Campaign management
- Offer submission and management
- Seller account management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Sway** - Making group buying simple, secure, and transparent through blockchain technology.
