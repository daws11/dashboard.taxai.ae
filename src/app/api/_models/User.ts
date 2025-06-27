import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  amount: Number,
  method: String,
  lastPaymentDate: Date,
  nextPaymentDate: Date,
}, { _id: false });

const SubscriptionSchema = new mongoose.Schema({
  type: { type: String, enum: ['monthly', 'quarterly', 'yearly', 'trial'] },
  status: { type: String, enum: ['active', 'expired', 'pending'] },
  messageLimit: Number,
  remainingMessages: Number,
  startDate: Date,
  endDate: Date,
  payment: PaymentSchema,
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  jobTitle: String,
  language: { type: String, default: null },
  subscription: SubscriptionSchema,
  trialUsed: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date,
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 