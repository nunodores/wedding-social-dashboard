import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { Guest } from './guest';
import { Post } from './post';

export class Notification extends Model {}

Notification.init({
  id: { type: DataTypes.STRING(191), primaryKey: true },
  to_guest_id: { type: DataTypes.STRING(191), allowNull: false },
  from_guest_id: { type: DataTypes.STRING(191) },
  post_id: { type: DataTypes.STRING(191) },
  type: { type: DataTypes.ENUM('like', 'comment', 'follow', 'mention'), allowNull: false },
  read_post: { type: DataTypes.BOOLEAN, defaultValue: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'notification',
  tableName: 'notifications',
  timestamps: false,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});
