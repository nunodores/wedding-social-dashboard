import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { Event } from './event';

export class Payment extends Model {}

Payment.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  event_id: { type: DataTypes.STRING(191), allowNull: false },
  stripe_payment_intent_id: { type: DataTypes.STRING },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  currency: { type: DataTypes.STRING(3), defaultValue: 'USD' },
  status: { type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'), defaultValue: 'pending' },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'payment',
  tableName: 'payments',
  timestamps: false,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});
