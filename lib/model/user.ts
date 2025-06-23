import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export class User extends Model {
  public id!: number;
  public email!: string;
  public password_hash!: string;
  public role!: 'admin' | 'couple';
  public name?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'couple'), allowNull: false },
  name: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { sequelize, modelName: 'user', tableName: 'users', timestamps: false,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt' });