import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { Guest } from './guest';

export class Follow extends Model {}

Follow.init({
  id: { type: DataTypes.STRING(191), primaryKey: true },
  follower_id: { type: DataTypes.STRING(191), allowNull: false },
  following_id: { type: DataTypes.STRING(191), allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'follow',
  tableName: 'follows',
  timestamps: false,
  indexes: [{ unique: true, fields: ['follower_id', 'following_id'] }]
});