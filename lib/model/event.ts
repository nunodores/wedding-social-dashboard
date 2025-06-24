import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { User } from './user';

export class Event extends Model {
  public id!: string;
  public name!: string;
  public event_code!: string;
  public couple_user_id!: number;
  public event_date?: string;
  public description?: string;
  public primary_color?: string;
  public logo_url?: string;
  public font_name?: string;
  public use_logo_text?: boolean;
  public status!: 'active' | 'inactive' | 'completed';
  public hashed_password!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations
  public user?: User;
}

Event.init({
  id: { type: DataTypes.STRING(191), primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  font_name: { type: DataTypes.STRING, allowNull: false },
  use_logo_text : { type: DataTypes.BOOLEAN},
  event_code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  couple_user_id: { type: DataTypes.INTEGER, allowNull: false },
  event_date: { type: DataTypes.DATEONLY },
  description: { type: DataTypes.TEXT },
  primary_color: { type: DataTypes.STRING(7), defaultValue: '#d946ef' },
  logo_url: { type: DataTypes.STRING(500) },
  status: { type: DataTypes.ENUM('active', 'inactive', 'completed'), defaultValue: 'active' },
  hashed_password: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'event',
  tableName: 'events',
  timestamps: false,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});
