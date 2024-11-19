export interface Category {
    id: string;
    name: string;
    icon?: string;
}
export interface ExpenseCategory extends Category {
}
export interface IncomeCategory extends Category {
}
export interface InvestmentCategory extends Category {
}
export interface CreditCard {
    id: string;
    name: string;
    bank: string;
    lastFourDigits: string;
    dueDate?: number;
    statementDate?: number;
}
export declare const COLORS: {
    primary: string;
    secondary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
};
export declare const INCOME_CATEGORIES: IncomeCategory[];
export declare const EXPENSE_CATEGORIES: ExpenseCategory[];
export declare const INVESTMENT_CATEGORIES: InvestmentCategory[];
