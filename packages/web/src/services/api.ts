import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};

// Transactions API
export interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  user: string;
}

export interface TransactionFormData {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface TransactionFilters {
  type?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  limit?: number;
}

export const transactionsAPI = {
  create: async (data: TransactionFormData) => {
    const response = await api.post('/transactions', {
      ...data,
      date: new Date(data.date)
    });
    return response.data;
  },

  getAll: async (params?: TransactionFilters) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  update: async (id: string, data: Partial<TransactionFormData>) => {
    const response = await api.patch(`/transactions/${id}`, {
      ...data,
      ...(data.date && { date: new Date(data.date) })
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getStats: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await api.get('/transactions/stats', { params });
    return response.data;
  },
};

// Investments API
export interface Investment {
  _id: string;
  name: string;
  amount: number;
  category: string;
  date: Date;
  notes?: string;
  user: string;
}

export interface InvestmentFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export const investmentsAPI = {
  create: async (data: Omit<Investment, '_id' | 'user'>) => {
    // Create investment
    const response = await api.post('/investments', data);
    
    // Create corresponding expense transaction
    await transactionsAPI.create({
      type: 'expense',
      amount: data.amount,
      category: 'investments',
      description: `Investment: ${data.name}`,
      date: new Date(data.date).toISOString().split('T')[0]
    });

    return response.data;
  },

  getAll: async (params?: InvestmentFilters) => {
    const response = await api.get('/investments', { params });
    return Array.isArray(response.data) ? response.data : [];
  },

  update: async (id: string, data: Partial<Omit<Investment, '_id' | 'user'>>) => {
    const response = await api.patch(`/investments/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/investments/${id}`);
    return response.data;
  },

  getStats: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await api.get('/investments/stats', { params });
    return response.data;
  },
};

// Dashboard API
export interface DashboardStats {
  transactions: {
    income: number;
    expense: number;
    recent: Transaction[];
  };
  investments: {
    total: number;
    byCategory: {
      category: string;
      total: number;
    }[];
  };
}

export const dashboardAPI = {
  getStats: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await api.get('/dashboard/stats', { params });
    return response.data;
  },
};

export default api;
