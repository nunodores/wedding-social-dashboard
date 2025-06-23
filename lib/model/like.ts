import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { Guest } from './guest';
import { Post } from './post';

export class Like extends Model {
  public id!: string;
  public guest_id!: string;
  public post_id!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations
  public guest?: Guest;
  public post?: Post;
}

Like.init({
  id: { type: DataTypes.STRING(191), primaryKey: true },
  guest_id: { type: DataTypes.STRING(191), allowNull: false },
  post_id: { type: DataTypes.STRING(191), allowNull: false },
  createdAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE(3), defaultValue: DataTypes.NOW },
}, {
  sequelize,
  modelName: 'like',
  tableName: 'likes',
  timestamps: false,
  indexes: [{ unique: true, fields: ['guest_id', 'post_id'] }]
});