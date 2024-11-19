// Types
export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface ExpenseCategory extends Category {}
export interface IncomeCategory extends Category {}
export interface InvestmentCategory extends Category {}
export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  lastFourDigits: string;
  dueDate?: number; // Day of the month
  statementDate?: number; // Day of the month
}

// Constants
export const COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
};

export const INCOME_CATEGORIES: IncomeCategory[] = [
  { id: 'salary', name: 'Salary' },
  { id: 'freelance', name: 'Freelance' },
  { id: 'business', name: 'Business Income' },
  { id: 'investments', name: 'Investment Returns' },
  { id: 'rental', name: 'Rental Income' },
  { id: 'other_income', name: 'Other Income' },
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'utilities', name: 'Utilities' },
  { id: 'rent', name: 'Rent/Housing' },
  { id: 'groceries', name: 'Groceries' },
  { id: 'transportation', name: 'Transportation' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'dining', name: 'Dining Out' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'education', name: 'Education' },
  { id: 'insurance', name: 'Insurance' },
  { id: 'credit_card', name: 'Credit Card Bill' },
  { id: 'other_expense', name: 'Other Expense' },
];

export const INVESTMENT_CATEGORIES: InvestmentCategory[] = [
  { id: 'stocks', name: 'Stocks' },
  { id: 'mutual_funds', name: 'Mutual Funds' },
  { id: 'fixed_deposits', name: 'Fixed Deposits' },
  { id: 'real_estate', name: 'Real Estate' },
  { id: 'crypto', name: 'Cryptocurrency' },
  { id: 'gold', name: 'Gold' },
  { id: 'bonds', name: 'Bonds' },
  { id: 'other_investment', name: 'Other Investment' },
];
