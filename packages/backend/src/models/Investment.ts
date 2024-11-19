import mongoose from 'mongoose';

export interface IInvestment extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  category: string;
  date: Date;
  notes?: string;
}

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
investmentSchema.index({ user: 1, date: -1 });
investmentSchema.index({ user: 1, category: 1 });

export const Investment = mongoose.model<IInvestment>('Investment', investmentSchema);
