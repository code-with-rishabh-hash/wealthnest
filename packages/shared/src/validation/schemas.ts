import { z } from 'zod';

export const investmentSchema = z.object({
  type: z.enum(['fd', 'rd', 'bond', 'mf', 'ppf', 'nsc', 'insurance', 'gold', 'property', 'stocks', 'nps', 'post_office', 'epf', 'other']),
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  institution: z.string().max(200).default(''),
  accountNo: z.string().max(50).default(''),
  principal: z.number().min(0, 'Must be positive').max(999_999_999_999, 'Amount too large'),
  currentValue: z.number().min(0).max(999_999_999_999).default(0),
  interestRate: z.number().min(0).max(100).default(0),
  startDate: z.string().default(''),
  maturityDate: z.string().default(''),
  nominee: z.string().max(200).default(''),
  notes: z.string().max(2000).default(''),
  status: z.enum(['active', 'matured', 'closed']).default('active'),
});

export const bankAccountSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required').max(200),
  accountNo: z.string().min(1, 'Account number is required').max(50),
  type: z.enum(['Savings', 'Current', 'NRE', 'NRO', 'Salary', 'Joint']).default('Savings'),
  balance: z.number().min(0).max(999_999_999_999).default(0),
  nominee: z.string().max(200).default(''),
  branch: z.string().max(200).default(''),
  ifsc: z.string().max(20).default(''),
  notes: z.string().max(2000).default(''),
});

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().min(0.01, 'Amount must be greater than 0').max(999_999_999_999),
  category: z.string().min(1, 'Category is required'),
  note: z.string().max(500).default(''),
  date: z.string().min(1, 'Date is required'),
});

export const masterPasswordSchema = z.string()
  .min(8, 'Minimum 8 characters required')
  .max(128, 'Password too long');

export type InvestmentFormData = z.infer<typeof investmentSchema>;
export type BankAccountFormData = z.infer<typeof bankAccountSchema>;
export type TransactionFormData = z.infer<typeof transactionSchema>;
