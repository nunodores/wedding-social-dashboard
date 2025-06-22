import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { Event } from './event';

export class Guest extends Model {}

Guest.init({
  id: { type: DataTypes.STRING(191), primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  hashed_password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  avatar_url: { type: DataTypes.STRING },
  fcm_token: { type: DataTypes.STRING },
  wedding_event_id: { type: DataTypes.STRING(191), allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'guest',
  tableName: 'guests',
  timestamps: false,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});
