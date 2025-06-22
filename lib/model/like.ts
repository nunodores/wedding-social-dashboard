import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { Guest } from './guest';
import { Post } from './post';

export class Like extends Model {}

Like.init({
  id: { type: DataTypes.STRING(191), primaryKey: true },
  guest_id: { type: DataTypes.STRING(191), allowNull: false },
  post_id: { type: DataTypes.STRING(191), allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'like',
  tableName: 'likes',
  timestamps: false,
  indexes: [{ unique: true, fields: ['guest_id', 'post_id'] }]
});