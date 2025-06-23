import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { Guest } from './guest';
import { Event } from './event';

export class Story extends Model {
  public id!: string;
  public media_url!: string;
  public expiresAt!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
  public guest_id!: string;
  public wedding_event_id!: string;

  // Associations
  public guest?: Guest;
  public event?: Event;
}

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
