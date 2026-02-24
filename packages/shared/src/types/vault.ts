export type InvestmentType =
  | 'fd' | 'rd' | 'bond' | 'mf' | 'ppf' | 'nsc'
  | 'insurance' | 'gold' | 'property' | 'stocks'
  | 'nps' | 'post_office' | 'epf' | 'other';

export type InvestmentStatus = 'active' | 'matured' | 'closed';

export type BankAccountType = 'Savings' | 'Current' | 'NRE' | 'NRO' | 'Salary' | 'Joint';

export type TransactionType = 'income' | 'expense';

export type Currency = '₹' | '$' | '€' | '£' | '¥';

export interface Investment {
  id: string;
  type: InvestmentType;
  name: string;
  institution: string;
  accountNo: string;
  principal: number;
  currentValue: number;
  interestRate: number;
  startDate: string;
  maturityDate: string;
  nominee: string;
  notes: string;
  status: InvestmentStatus;
  createdAt: number;
  lastUpdated?: number;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNo: string;
  type: BankAccountType;
  balance: number;
  nominee: string;
  branch: string;
  ifsc: string;
  notes: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: string;
  ts: number;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  month: string;
}

export interface VaultData {
  investments: Investment[];
  bankAccounts: BankAccount[];
  transactions: Transaction[];
  budgets: Budget[];
  nominees: string[];
  currency: Currency;
  createdAt: number;
  lastModified?: number;
}

export interface EncryptedBlob {
  s: number[];
  i: number[];
  d: number[];
  v: number;
  integrity: string;
}

export interface InvestmentTypeInfo {
  id: InvestmentType;
  label: string;
  icon: string;
  color: string;
}

export interface CategoryInfo {
  id: string;
  label: string;
  icon: string;
  color: string;
}
