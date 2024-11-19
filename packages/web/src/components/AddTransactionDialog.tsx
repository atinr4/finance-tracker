import React, { useState } from 'react';
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
  Stack,
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

interface AddTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (transaction: Transaction) => void;
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [transaction, setTransaction] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
  });

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
    if (
      transaction.date &&
      transaction.description &&
      transaction.amount &&
      transaction.category &&
      transaction.type
    ) {
      onAdd({
        ...transaction as Transaction,
        id: new Date().getTime().toString(),
        amount: Number(transaction.amount),
      });
      setTransaction({
        date: new Date().toISOString().split('T')[0],
      });
      onClose();
    }
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={transaction.type || ''}
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
              value={transaction.description || ''}
              onChange={handleChange}
              required
            />

            <TextField
              label="Amount"
              type="number"
              fullWidth
              name="amount"
              value={transaction.amount || ''}
              onChange={handleChange}
              required
              inputProps={{ min: 0, step: "0.01" }}
            />

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={transaction.category || ''}
                onChange={handleSelectChange}
                label="Category"
                required
                disabled={!transaction.type}
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
              value={transaction.date || ''}
              onChange={handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTransactionDialog;
