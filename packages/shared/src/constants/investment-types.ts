import type { InvestmentTypeInfo, CategoryInfo, BankAccountType, Currency } from '../types/vault.js';

export const INV_TYPES: InvestmentTypeInfo[] = [
  { id: 'fd', label: 'Fixed Deposit', icon: '\u{1F3E6}', color: '#3498DB' },
  { id: 'rd', label: 'Recurring Deposit', icon: '\u{1F4B3}', color: '#2980B9' },
  { id: 'bond', label: 'Bonds / Debentures', icon: '\u{1F4DC}', color: '#8E44AD' },
  { id: 'mf', label: 'Mutual Fund', icon: '\u{1F4C8}', color: '#27AE60' },
  { id: 'ppf', label: 'PPF', icon: '\u{1F3DB}', color: '#16A085' },
  { id: 'nsc', label: 'NSC', icon: '\u{1F4E8}', color: '#D35400' },
  { id: 'insurance', label: 'Insurance / LIC', icon: '\u{1F6E1}', color: '#E74C3C' },
  { id: 'gold', label: 'Gold / Jewellery', icon: '\u{1F947}', color: '#F1C40F' },
  { id: 'property', label: 'Real Estate', icon: '\u{1F3E0}', color: '#E67E22' },
  { id: 'stocks', label: 'Stocks / Equity', icon: '\u{1F4CA}', color: '#2ECC71' },
  { id: 'nps', label: 'NPS', icon: '\u{1F465}', color: '#1ABC9C' },
  { id: 'post_office', label: 'Post Office Scheme', icon: '\u{1F4EE}', color: '#9B59B6' },
  { id: 'epf', label: 'EPF / PF', icon: '\u{1F3ED}', color: '#607D8B' },
  { id: 'other', label: 'Other', icon: '\u{1F4E6}', color: '#95A5A6' },
];

export const BANK_TYPES: BankAccountType[] = ['Savings', 'Current', 'NRE', 'NRO', 'Salary', 'Joint'];

export const EXPENSE_CATEGORIES: CategoryInfo[] = [
  { id: 'housing', label: 'Housing', icon: '\u{1F3E0}', color: '#E74C3C' },
  { id: 'food', label: 'Food & Dining', icon: '\u{1F37D}', color: '#E67E22' },
  { id: 'transport', label: 'Transport', icon: '\u{1F697}', color: '#F1C40F' },
  { id: 'utilities', label: 'Utilities', icon: '\u{1F4A1}', color: '#2ECC71' },
  { id: 'health', label: 'Healthcare', icon: '\u{1F3E5}', color: '#1ABC9C' },
  { id: 'shopping', label: 'Shopping', icon: '\u{1F6CD}', color: '#9B59B6' },
  { id: 'education', label: 'Education', icon: '\u{1F4DA}', color: '#E91E63' },
  { id: 'other', label: 'Other', icon: '\u{1F4E6}', color: '#95A5A6' },
];

export const INCOME_CATEGORIES: CategoryInfo[] = [
  { id: 'salary', label: 'Salary', icon: '\u{1F4B0}', color: '#27AE60' },
  { id: 'interest', label: 'Interest', icon: '\u{1F4C8}', color: '#3498DB' },
  { id: 'maturity', label: 'Maturity Proceeds', icon: '\u{1F3E6}', color: '#8E44AD' },
  { id: 'dividend', label: 'Dividend', icon: '\u{1F4B5}', color: '#16A085' },
  { id: 'rental', label: 'Rental', icon: '\u{1F3D8}', color: '#D35400' },
  { id: 'other_inc', label: 'Other', icon: '\u{1F4B5}', color: '#7F8C8D' },
];

export const CURRENCIES: Currency[] = ['₹', '$', '€', '£', '¥'];

export const NOM_COLORS = ['#3498DB', '#E74C3C', '#2ECC71', '#9B59B6', '#E67E22', '#1ABC9C', '#F1C40F', '#607D8B'];

export const MAX_ATTEMPTS = 5;
export const SESSION_TIMEOUT = 15 * 60 * 1000;

export function getInvestmentInfo(id: string): InvestmentTypeInfo {
  return INV_TYPES.find(t => t.id === id) || INV_TYPES[INV_TYPES.length - 1];
}

export function getCategoryInfo(id: string, type: 'income' | 'expense'): CategoryInfo {
  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return cats.find(c => c.id === id) || { id, label: id, icon: '?', color: '#999' };
}
