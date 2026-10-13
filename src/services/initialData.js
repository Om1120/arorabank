export const initialUsers = {
  customer: {
    id: "usr_cust_01",
    name: "Alex Morgan",
    email: "alex.morgan@aurorabank.demo",
    role: "customer",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    tier: "Aurora Private Client",
    kycStatus: "VERIFIED",
    kycVerifiedDate: "15 Jan 2026",
    twoFactorEnabled: true,
    address: "704 Tower B, Waterfront Heights, Mumbai 400051"
  },
  admin: {
    id: "usr_admin_01",
    name: "Elena Rostova",
    email: "elena.admin@aurorabank.demo",
    role: "admin",
    phone: "+91 91234 56789",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    tier: "Operations & Risk Lead",
    title: "Executive VP of Settlement Systems",
    kycStatus: "VERIFIED",
    twoFactorEnabled: true
  }
};

export const initialAccounts = [
  {
    id: "acc_chk_01",
    name: "Aurora Signature Checking",
    accountNumber: "AUR-8829-4102-991",
    type: "Checking",
    currency: "INR",
    symbol: "₹",
    balance: 248500.00,
    status: "ACTIVE",
    ifsc: "AURB0002941",
    branch: "Bandra Kurla Complex, Mumbai",
    color: "#0F172A",
    tag: "Primary Account"
  },
  {
    id: "acc_sav_01",
    name: "Aurora High-Yield Reserve",
    accountNumber: "AUR-9941-8812-304",
    type: "Savings",
    currency: "INR",
    symbol: "₹",
    balance: 815420.50,
    status: "ACTIVE",
    apy: "6.85% APY",
    ifsc: "AURB0002941",
    branch: "Bandra Kurla Complex, Mumbai",
    color: "#059669",
    tag: "High Yield"
  },
  {
    id: "acc_vlt_01",
    name: "Aurora Term Growth Vault",
    accountNumber: "AUR-1102-9988-771",
    type: "Vault",
    currency: "INR",
    symbol: "₹",
    balance: 450000.00,
    status: "ACTIVE",
    interestRate: "7.40% Fixed",
    maturityDate: "28 Nov 2027",
    color: "#D97706",
    tag: "Locked Deposit"
  }
];

export const initialCards = [
  {
    id: "crd_01",
    accountId: "acc_chk_01",
    cardHolder: "ALEX MORGAN",
    cardNumber: "4532 8920 4481 9920",
    maskedNumber: "•••• •••• •••• 9920",
    expiry: "08/30",
    cvv: "492",
    network: "VISA",
    type: "Titanium Debit",
    status: "ACTIVE",
    dailyOnlineLimit: 150000,
    currentOnlineSpend: 32400,
    dailyAtmLimit: 50000,
    currentAtmSpend: 10000,
    internationalAllowed: true,
    contactlessAllowed: true,
    theme: "card-navy"
  },
  {
    id: "crd_02",
    accountId: "acc_sav_01",
    cardHolder: "ALEX MORGAN",
    cardNumber: "5412 7510 3390 1208",
    maskedNumber: "•••• •••• •••• 1208",
    expiry: "12/29",
    cvv: "817",
    network: "MASTERCARD",
    type: "Emerald World Elite",
    status: "ACTIVE",
    dailyOnlineLimit: 300000,
    currentOnlineSpend: 84500,
    dailyAtmLimit: 100000,
    currentAtmSpend: 0,
    internationalAllowed: true,
    contactlessAllowed: true,
    theme: "card-emerald"
  }
];

export const initialTransactions = [
  {
    id: "txn_001",
    referenceId: "AUR-TXN-2026-9841",
    accountId: "acc_chk_01",
    date: "2026-10-12",
    timestamp: "2026-10-12T10:15:30Z",
    type: "CREDIT",
    amount: 185000.00,
    category: "Salary",
    description: "Monthly Executive Payroll Deposit",
    counterparty: "Antigravity Global Inc",
    counterpartyAccount: "CITI-US-009218",
    method: "NEFT",
    status: "COMPLETED",
    balanceAfter: 248500.00,
    notes: "Direct direct electronic fund transfer"
  },
  {
    id: "txn_002",
    referenceId: "AUR-TXN-2026-9812",
    accountId: "acc_chk_01",
    date: "2026-10-11",
    timestamp: "2026-10-11T19:42:10Z",
    type: "DEBIT",
    amount: 8450.00,
    category: "Dining",
    description: "Dinner at Le Cirque Gourmet",
    counterparty: "The Leela Palace Mumbai",
    counterpartyAccount: "POS-LEELA-889",
    method: "Card POS",
    status: "COMPLETED",
    balanceAfter: 63500.00,
    notes: "Visa Contactless payment"
  },
  {
    id: "txn_003",
    referenceId: "AUR-TXN-2026-9799",
    accountId: "acc_chk_01",
    date: "2026-10-10",
    timestamp: "2026-10-10T14:20:00Z",
    type: "DEBIT",
    amount: 25000.00,
    category: "Transfer",
    description: "Transfer to Sarah Jenkins",
    counterparty: "Sarah Jenkins",
    counterpartyAccount: "AUR-3341-9921-102",
    method: "UPI Instant",
    status: "COMPLETED",
    balanceAfter: 71950.00,
    notes: "Project freelance consulting advance"
  },
  {
    id: "txn_004",
    referenceId: "AUR-TXN-2026-9740",
    accountId: "acc_sav_01",
    date: "2026-10-09",
    timestamp: "2026-10-09T08:00:00Z",
    type: "CREDIT",
    amount: 4620.50,
    category: "Investments",
    description: "Quarterly Interest Credit (6.85% APY)",
    counterparty: "Aurora Yield Core",
    counterpartyAccount: "AUR-SYSTEM-INT",
    method: "System Auto-Credit",
    status: "COMPLETED",
    balanceAfter: 815420.50,
    notes: "Compound interest auto accrued"
  },
  {
    id: "txn_005",
    referenceId: "AUR-TXN-2026-9711",
    accountId: "acc_chk_01",
    date: "2026-10-08",
    timestamp: "2026-10-08T16:30:15Z",
    type: "DEBIT",
    amount: 14200.00,
    category: "Tech & Cloud",
    description: "Annual Cloud Infrastructure License",
    counterparty: "Apex Cloud Services Inc",
    counterpartyAccount: "HDFC000192837",
    method: "IMPS",
    status: "COMPLETED",
    balanceAfter: 96950.00,
    notes: "Cloud backup and developer compute instances"
  },
  {
    id: "txn_006",
    referenceId: "AUR-TXN-2026-9685",
    accountId: "acc_chk_01",
    date: "2026-10-06",
    timestamp: "2026-10-06T11:10:00Z",
    type: "DEBIT",
    amount: 6800.00,
    category: "Groceries",
    description: "Whole Foods Organic Market",
    counterparty: "Nature's Basket Fine Foods",
    counterpartyAccount: "POS-NAT-2201",
    method: "Card POS",
    status: "COMPLETED",
    balanceAfter: 111150.00,
    notes: "Groceries and pantry supply"
  },
  {
    id: "txn_007",
    referenceId: "AUR-TXN-2026-9640",
    accountId: "acc_chk_01",
    date: "2026-10-04",
    timestamp: "2026-10-04T12:00:00Z",
    type: "DEBIT",
    amount: 50000.00,
    category: "Internal Transfer",
    description: "Savings Stash to High-Yield Reserve",
    counterparty: "Aurora High-Yield Reserve",
    counterpartyAccount: "AUR-9941-8812-304",
    method: "Internal",
    status: "COMPLETED",
    balanceAfter: 117950.00,
    notes: "Automated monthly wealth allocation"
  },
  {
    id: "txn_008",
    referenceId: "AUR-TXN-2026-9602",
    accountId: "acc_chk_01",
    date: "2026-10-02",
    timestamp: "2026-10-02T15:45:00Z",
    type: "CREDIT",
    amount: 12500.00,
    category: "Investments",
    description: "Stock Dividend Payout",
    counterparty: "National Stock Depository (NSDL)",
    counterpartyAccount: "NSDL-DIV-8891",
    method: "RTGS",
    status: "COMPLETED",
    balanceAfter: 167950.00,
    notes: "Semiannual dividend distribution"
  },
  {
    id: "txn_009",
    referenceId: "AUR-TXN-2026-9580",
    accountId: "acc_chk_01",
    date: "2026-09-29",
    timestamp: "2026-09-29T18:10:00Z",
    type: "DEBIT",
    amount: 4500.00,
    category: "Utilities",
    description: "High-Speed Fiber & Smart Meter Billing",
    counterparty: "Metropolitan Utilities Ltd",
    counterpartyAccount: "BILL-METRO-9941",
    method: "Auto-Debit",
    status: "COMPLETED",
    balanceAfter: 155450.00,
    notes: "Fiber Broadband & City Electric bill"
  },
  {
    id: "txn_010",
    referenceId: "AUR-TXN-2026-9520",
    accountId: "acc_chk_01",
    date: "2026-09-27",
    timestamp: "2026-09-27T10:05:00Z",
    type: "DEBIT",
    amount: 18500.00,
    category: "Travel",
    description: "Business Flight Booking Mumbai - Singapore",
    counterparty: "Singapore Airlines Corporate",
    counterpartyAccount: "SQ-AIR-CORP-912",
    method: "Card Online",
    status: "COMPLETED",
    balanceAfter: 159950.00,
    notes: "Round trip executive flight"
  }
];

export const initialPayees = [
  {
    id: "payee_01",
    name: "Sarah Jenkins",
    type: "Aurora Internal",
    accountNumber: "AUR-3341-9921-102",
    upiId: "sarah.j@aurora",
    bankName: "Aurora Bank",
    nickname: "Sarah (Consultant)",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    lastTransferred: "10 Oct 2026"
  },
  {
    id: "payee_02",
    name: "Apex Cloud Services",
    type: "NEFT / RTGS",
    accountNumber: "HDFC000192837",
    ifsc: "HDFC0000049",
    bankName: "HDFC Bank",
    nickname: "Dev Cloud Host",
    avatar: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80",
    lastTransferred: "08 Oct 2026"
  },
  {
    id: "payee_03",
    name: "Dr. Rajesh K. Sharma",
    type: "UPI Instant",
    accountNumber: "AXIS-9928173461",
    upiId: "rajesh.md@okaxis",
    bankName: "Axis Bank",
    nickname: "Dr. Sharma",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&auto=format&fit=crop&q=80",
    lastTransferred: "15 Sep 2026"
  },
  {
    id: "payee_04",
    name: "Priya Nair",
    type: "Aurora Internal",
    accountNumber: "AUR-7729-1102-443",
    upiId: "priya.n@aurora",
    bankName: "Aurora Bank",
    nickname: "Priya (Sister)",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    lastTransferred: "22 Sep 2026"
  }
];

export const monthlyCashflowData = [
  { month: "May", income: 185000, expenses: 92000, savings: 93000 },
  { month: "Jun", income: 192000, expenses: 104000, savings: 88000 },
  { month: "Jul", income: 185000, expenses: 88000, savings: 97000 },
  { month: "Aug", income: 215000, expenses: 110000, savings: 105000 },
  { month: "Sep", income: 198000, expenses: 95000, savings: 103000 },
  { month: "Oct (MTD)", income: 202120, expenses: 64450, savings: 137670 }
];

export const spendingCategoryData = [
  { name: "Tech & Cloud", value: 14200, color: "#3B82F6" },
  { name: "Dining & Gourmet", value: 8450, color: "#F59E0B" },
  { name: "Groceries", value: 6800, color: "#10B981" },
  { name: "Utilities", value: 4500, color: "#8B5CF6" },
  { name: "Travel & Commute", value: 18500, color: "#EC4899" },
  { name: "Personal Transfers", value: 25000, color: "#06B6D4" }
];

export const netWorthGrowthData = [
  { date: "May 2026", netWorth: 1120000, liquid: 620000 },
  { date: "Jun 2026", netWorth: 1210000, liquid: 690000 },
  { date: "Jul 2026", netWorth: 1295000, liquid: 765000 },
  { date: "Aug 2026", netWorth: 1380000, liquid: 870000 },
  { date: "Sep 2026", netWorth: 1465000, liquid: 945000 },
  { date: "Oct 2026", netWorth: 1513920, liquid: 1063920 }
];
