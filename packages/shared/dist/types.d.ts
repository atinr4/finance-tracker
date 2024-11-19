export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
    type: 'income' | 'expense' | 'investment';
}
export interface ExpenseCategory {
    id: string;
    name: string;
    type: 'fixed' | 'variable';
    icon: string;
}
export interface InvestmentCategory {
    id: string;
    name: string;
    type: string;
    riskLevel: 'low' | 'medium' | 'high';
    icon: string;
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
