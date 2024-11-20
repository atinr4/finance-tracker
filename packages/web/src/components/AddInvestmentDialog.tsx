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
import { INVESTMENT_CATEGORIES } from '@finance-tracker/shared/dist/constants';
import { Investment } from '../services/api';

interface AddInvestmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (investment: Omit<Investment, '_id' | 'user'>) => void;
}

const AddInvestmentDialog: React.FC<AddInvestmentDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [investment, setInvestment] = useState<Partial<Omit<Investment, '_id' | 'user'>>>({
    date: new Date(),
  });

  const [dateString, setDateString] = useState(new Date().toISOString().split('T')[0]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name === 'date') {
      setDateString(value as string);
      setInvestment(prev => ({
        ...prev,
        date: new Date(value as string),
      }));
    } else {
      setInvestment((prev) => ({
        ...prev,
        [name as string]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (investment.name && investment.amount && investment.category && investment.date) {
      onSubmit({
        name: investment.name,
        amount: Number(investment.amount),
        category: investment.category,
        date: investment.date,
        notes: investment.notes,
      });
      setInvestment({
        date: new Date(),
      });
      setDateString(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New Investment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              name="name"
              label="Investment Name"
              fullWidth
              required
              value={investment.name || ''}
              onChange={handleChange}
            />
            <TextField
              name="amount"
              label="Amount"
              type="number"
              fullWidth
              required
              value={investment.amount || ''}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={investment.category || ''}
                onChange={handleChange as (event: SelectChangeEvent<string>) => void}
                label="Category"
              >
                {INVESTMENT_CATEGORIES.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="date"
              label="Date"
              type="date"
              fullWidth
              required
              value={dateString}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="notes"
              label="Notes"
              fullWidth
              multiline
              rows={3}
              value={investment.notes || ''}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add Investment
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddInvestmentDialog;
