import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
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

interface EditInvestmentDialogProps {
  isOpen: boolean;
  handleClose: () => void;
  investment: Investment | null;
  handleSave: (updatedInvestment: Investment) => void;
}

const EditInvestmentDialog: React.FC<EditInvestmentDialogProps> = ({
  isOpen,
  handleClose,
  investment,
  handleSave,
}) => {
  const [formData, setFormData] = useState<Investment>({
    id: '',
    name: '',
    amount: 0,
    category: '',
    date: '',
    notes: '',
  });

  useEffect(() => {
    if (investment) {
      setFormData(investment);
    }
  }, [investment]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave({
      ...formData,
      amount: Number(formData.amount),
    });
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Investment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Investment Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />

            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 0, step: "0.01" }}
            />

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={handleCategoryChange}
                name="category"
                required
              >
                {INVESTMENT_CATEGORIES.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditInvestmentDialog;
