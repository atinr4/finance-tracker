import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import type { CreditCard } from '@finance-tracker/shared';

interface CreditCardDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (card: CreditCard) => void;
  card?: CreditCard;
}

const CreditCardDialog: React.FC<CreditCardDialogProps> = ({
  open,
  onClose,
  onSave,
  card,
}) => {
  const [formData, setFormData] = useState<Partial<CreditCard>>(
    card || {
      name: '',
      bank: '',
      lastFourDigits: '',
      dueDate: undefined,
      statementDate: undefined,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number | undefined = value;
    
    // Convert date inputs to numbers and validate range
    if (name === 'dueDate' || name === 'statementDate') {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 1 && numValue <= 31) {
        processedValue = numValue;
      } else if (value === '') {
        processedValue = undefined;
      } else {
        return; // Invalid date value
      }
    }

    // Validate last four digits
    if (name === 'lastFourDigits' && value.length > 4) {
      return;
    }

    setFormData((prev: Partial<CreditCard>) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.bank && formData.lastFourDigits) {
      onSave({
        ...formData as CreditCard,
        id: card?.id || new Date().getTime().toString(),
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {card ? 'Edit Credit Card' : 'Add Credit Card'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Card Name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              fullWidth
              required
              placeholder="e.g., Amazon Pay ICICI"
            />
            <TextField
              label="Bank Name"
              name="bank"
              value={formData.bank || ''}
              onChange={handleChange}
              fullWidth
              required
              placeholder="e.g., ICICI Bank"
            />
            <TextField
              label="Last 4 Digits"
              name="lastFourDigits"
              value={formData.lastFourDigits || ''}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ maxLength: 4 }}
              placeholder="1234"
            />
            <TextField
              label="Due Date (Day of Month)"
              name="dueDate"
              type="number"
              value={formData.dueDate || ''}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 1, max: 31 }}
              placeholder="e.g., 15"
            />
            <TextField
              label="Statement Date (Day of Month)"
              name="statementDate"
              type="number"
              value={formData.statementDate || ''}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 1, max: 31 }}
              placeholder="e.g., 1"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {card ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreditCardDialog;
