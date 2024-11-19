"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVESTMENT_CATEGORIES = exports.EXPENSE_CATEGORIES = exports.INCOME_CATEGORIES = exports.COLORS = void 0;
// Constants
exports.COLORS = {
    primary: '#1976d2',
    secondary: '#dc004e',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
};
exports.INCOME_CATEGORIES = [
    { id: 'salary', name: 'Salary' },
    { id: 'freelance', name: 'Freelance' },
    { id: 'business', name: 'Business Income' },
    { id: 'investments', name: 'Investment Returns' },
    { id: 'rental', name: 'Rental Income' },
    { id: 'other_income', name: 'Other Income' },
];
exports.EXPENSE_CATEGORIES = [
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
exports.INVESTMENT_CATEGORIES = [
    { id: 'stocks', name: 'Stocks' },
    { id: 'mutual_funds', name: 'Mutual Funds' },
    { id: 'fixed_deposits', name: 'Fixed Deposits' },
    { id: 'real_estate', name: 'Real Estate' },
    { id: 'crypto', name: 'Cryptocurrency' },
    { id: 'gold', name: 'Gold' },
    { id: 'bonds', name: 'Bonds' },
    { id: 'other_investment', name: 'Other Investment' },
];
