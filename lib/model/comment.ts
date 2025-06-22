import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { Guest } from './guest';
import { Post } from './post';

export class Comment extends Model {}

Comment.init({
  id: { type: DataTypes.STRING(191), primaryKey: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  guest_id: { type: DataTypes.STRING(191), allowNull: false },
  post_id: { type: DataTypes.STRING(191), allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'comment',
  tableName: 'comments',
  timestamps: false
});
