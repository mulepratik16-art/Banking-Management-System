export type AccountType = 'Savings' | 'Checking' | 'Fixed Deposit';

export interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  isFrozen: boolean;
}

export interface BankAccount {
  id: string;
  userId?: string;
  accountNumber: string;
  accountType: AccountType;
  accountName: string;
  balancePaise: number; // Integer paise (e.g. ₹14,250 = 1425000 paise)
  balance: number; // In Rupees for display: balancePaise / 100
  currency: string;
  interestRate: number; // percentage
  ifsc: string;
  openingDate: string;
  minBalancePaise: number;
  minBalance: number; // In Rupees for display: minBalancePaise / 100
  isFrozen?: boolean;
  cardDetails?: CardDetails;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer_out' | 'transfer_in' | 'interest';
export type TransactionCategory = 'Education' | 'Living' | 'Transfer' | 'Dining' | 'Utilities' | 'Deposit' | 'ATM' | 'Salary';

export interface Transaction {
  id: string;
  userId?: string;
  date: string; // ISO string
  amountPaise: number; // Integer paise
  amount: number; // In Rupees for display
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  referenceNo: string;
  accountId: string; // which account this relates to
  toAccount?: string;
  recipientName?: string;
  senderName?: string;
  paymentMode: string; // e.g., 'IMPS Instant', 'Counter Cash', 'ATM Simulation', 'NEFT'
  idempotencyKey?: string;
  status: 'Completed' | 'Pending' | 'Failed';
  balanceAfterPaise: number; // Integer paise
  balanceAfter: number; // In Rupees for display
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  nickname: string;
  type: 'Internal' | 'External';
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  rollNo: string;
  semester: string;
  projectTitle: string;
  address: string;
  avatarUrl: string;
  kycStatus: 'Verified' | 'Pending Approval';
  customerSince: string;
  branch: string;
  university?: string;
}

export interface MonthlyCashflow {
  month: string;
  deposits: number;
  withdrawals: number;
  balance: number;
}

export type NavPage =
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'accounts'
  | 'deposit'
  | 'withdraw'
  | 'transfer'
  | 'transactions'
  | 'profile'
  | 'help';

export const paiseToRupees = (paise: number): number => {
  return Number((paise / 100).toFixed(2));
};

export const rupeesToPaise = (rupees: number): number => {
  return Math.round(rupees * 100);
};

export const formatINR = (paise: number): string => {
  return (paise / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
