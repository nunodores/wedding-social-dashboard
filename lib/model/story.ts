import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { Guest } from './guest';
import { Event } from './event';

export class Story extends Model {}

Story.init({
  id: { type: DataTypes.STRING(191), primaryKey: true },
  media_url: { type: DataTypes.STRING(191), allowNull: false },
  expiresAt: { type: DataTypes.DATE(3), allowNull: false },
  createdAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
  guest_id: { type: DataTypes.STRING(191), allowNull: false },
  wedding_event_id: { type: DataTypes.STRING(191), allowNull: false }
}, {
  sequelize,
  modelName: 'story',
  tableName: 'stories',
  timestamps: false
});
