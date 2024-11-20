import React, { useEffect, useState } from 'react';
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

interface EditInvestmentDialogProps {
  open: boolean;
  onClose: () => void;
  investment: Investment | null;
  onSubmit: (investment: Partial<Investment>) => void;
}

const EditInvestmentDialog: React.FC<EditInvestmentDialogProps> = ({
  open,
  onClose,
  investment,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<Investment>>({});
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    if (investment) {
      setFormData({
        ...investment,
        date: new Date(investment.date),
      });
      setDateString(new Date(investment.date).toISOString().split('T')[0]);
    }
  }, [investment]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name === 'date') {
      setDateString(value as string);
      setFormData(prev => ({
        ...prev,
        date: new Date(value as string),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name as string]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.amount && formData.category && formData.date) {
      onSubmit({
        ...formData,
        amount: Number(formData.amount),
        date: formData.date,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Investment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              name="name"
              label="Investment Name"
              fullWidth
              required
              value={formData.name || ''}
              onChange={handleChange}
            />
            <TextField
              name="amount"
              label="Amount"
              type="number"
              fullWidth
              required
              value={formData.amount || ''}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category || ''}
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
              value={formData.notes || ''}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditInvestmentDialog;
