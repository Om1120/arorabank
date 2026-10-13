# Aurora Bank — Intelligent Next-Generation Banking Platform

Aurora Bank is a modern, high-performance digital banking and wealth governance web application built with **React 19**, **Vite**, **Redux Toolkit**, and **Recharts**.

## 🌟 Key Features

### 1. Multi-Vault Liquidity & Accounts
- **Signature Checking**: Liquid checking account for everyday transactional settlements.
- **High-Yield Reserve**: High-yield savings vault offering 6.85% APY compounding quarterly.
- **Term Growth Vault**: Fixed deposit vault offering guaranteed 7.40% interest.
- **Sub-Vault Provisioning**: Open customized savings, checking, or locked vaults on-the-fly.

### 2. Money Transfers & Settlement Hub
- **Instant Transfers**: Zero-fee instant transfers across IMPS, UPI FastPay, NEFT, and RTGS rails.
- **Internal Multi-Vault Rebalancing**: Move capital between checking and vaults in real-time.
- **Beneficiaries Management**: Save, edit, and delete payees with instant shortcut transfers.
- **Official Ledger Receipts**: Real-time printable clearance slips and downloadable statements.

### 3. Cards & Security Governance
- **Interactive 3D Card Preview**: Flip and reveal CVV, expiration, and masked PAN numbers.
- **Granular Spend Ceilings**: Adjustable daily online transaction and ATM withdrawal sliders.
- **Channel Access Controls**: Toggle international currency settlement and contactless NFC tap-to-pay.
- **Security Actions**: Instant card freeze/unfreeze, 4-digit PIN reset, and lost/compromised card replacement.

### 4. Wealth Intelligence & Analytics
- **Historical Net Worth Trajectory**: 6-month historical net worth progression using interactive Recharts area graphs.
- **Spending vs. Budget Caps**: Interactive category breakdown comparing real-time spend vs set budget limits.
- **Financial Health Goals**: Progress trackers for liquid emergency runway, term accumulation, and yield targets.
- **Algorithmic Insights**: Automated liquidity rebalancing suggestions.

### 5. Bank Operations & Risk Console (Admin Portal)
- **Account Status Oversight**: Freeze or restore accounts for compliance audits.
- **Simulated Liquidity Injection**: Credit sandbox capital into vaults for stress testing.
- **Compliance Audit Queue**: Flag suspicious transfers or clear audits.
- **Sandbox Factory Reset**: Instantly restore default accounts, cards, and transaction records.

## 🛠️ Technology Stack
- **Framework**: React 19 + Vite
- **State Management**: Redux Toolkit + React-Redux
- **Routing**: React Router DOM (v7)
- **Styling**: Bootstrap 5 + Vanilla CSS Design System with CSS Custom Properties
- **Data Visualization**: Recharts (Area Charts, Bar Charts, Pie Charts)
- **Icons**: Lucide React
- **Forms & Validation**: Formik + Yup
- **Linting & Code Quality**: Oxlint (0 warnings, 0 errors)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Om1120/arorabank.git

# Navigate to project directory
cd arorabank

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
```

## 🔒 Security Notice
Aurora Bank is an interactive frontend technical demonstration. All balances, transactions, and settlement actions operate entirely within client-side storage with zero real money moved.
