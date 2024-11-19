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

interface Investment {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

interface AddInvestmentDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (investment: Investment) => void;
}

const AddInvestmentDialog: React.FC<AddInvestmentDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [investment, setInvestment] = useState<Partial<Investment>>({
    date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setInvestment((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setInvestment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      investment.date &&
      investment.name &&
      investment.amount &&
      investment.category
    ) {
      onAdd({
        ...investment as Investment,
        id: new Date().getTime().toString(),
        amount: Number(investment.amount),
      });
      setInvestment({
        date: new Date().toISOString().split('T')[0],
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Investment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Date"
              type="date"
              fullWidth
              name="date"
              value={investment.date || ''}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Name"
              type="text"
              fullWidth
              name="name"
              value={investment.name || ''}
              onChange={handleChange}
            />
            <TextField
              label="Amount"
              type="number"
              fullWidth
              name="amount"
              value={investment.amount || ''}
              onChange={handleChange}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={investment.category || ''}
                onChange={handleSelectChange}
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
              label="Notes"
              type="text"
              fullWidth
              multiline
              rows={4}
              name="notes"
              value={investment.notes || ''}
              onChange={handleChange}
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

export default AddInvestmentDialog;
