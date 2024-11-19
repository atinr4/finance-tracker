export type ExpenseType = 'fixed' | 'variable';
export type RiskLevel = 'low' | 'medium' | 'high';
export type TransactionType = 'income' | 'expense' | 'investment';
export interface ExpenseCategory {
    id: string;
    name: string;
    type: ExpenseType;
    icon: string;
}
export interface InvestmentCategory {
    id: string;
    name: string;
    type: string;
    riskLevel: RiskLevel;
    icon: string;
}
export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
    type: TransactionType;
}
export interface MonthlyBudget {
    month: string;
    year: number;
    income: number;
    expenses: {
        [category: string]: number;
    };
    savings: number;
}
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    currency: string;
    monthlyIncome?: number;
    budgetAlerts: boolean;
}
