import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import type {
  ExpenseCategory,
  IncomeCategory,
  InvestmentCategory,
} from '@finance-tracker/shared';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  INVESTMENT_CATEGORIES,
} from '@finance-tracker/shared';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense' | 'investment';
}

interface EditTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onEdit: (transaction: Transaction) => void;
  transaction: Transaction | null;
}

const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({
  open,
  onClose,
  onEdit,
  transaction: initialTransaction,
}) => {
  const [transaction, setTransaction] = useState<Transaction>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    category: '',
    type: 'expense',
  });

  useEffect(() => {
    if (initialTransaction) {
      setTransaction(initialTransaction);
    }
  }, [initialTransaction]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: value,
      // Reset category when type changes
      ...(name === 'type' ? { category: '' } : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit({
      ...transaction,
      amount: Number(transaction.amount),
    });
    onClose();
  };

  const getCategoryOptions = (): (ExpenseCategory | IncomeCategory | InvestmentCategory)[] => {
    switch (transaction.type) {
      case 'income':
        return INCOME_CATEGORIES;
      case 'expense':
        return EXPENSE_CATEGORIES;
      case 'investment':
        return INVESTMENT_CATEGORIES;
      default:
        return [];
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={transaction.type}
              onChange={handleSelectChange}
              label="Type"
              required
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
              <MenuItem value="investment">Investment</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Description"
            type="text"
            fullWidth
            name="description"
            value={transaction.description}
            onChange={handleChange}
            required
            margin="normal"
          />

          <TextField
            label="Amount"
            type="number"
            fullWidth
            name="amount"
            value={transaction.amount}
            onChange={handleChange}
            required
            margin="normal"
            inputProps={{ min: 0, step: "0.01" }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={transaction.category}
              onChange={handleSelectChange}
              label="Category"
              required
            >
              {getCategoryOptions().map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Date"
            type="date"
            fullWidth
            name="date"
            value={transaction.date}
            onChange={handleChange}
            required
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditTransactionDialog;
