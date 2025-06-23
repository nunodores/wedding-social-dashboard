import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { Guest } from './guest';
import { Event } from './event';
import { Comment } from './comment';
import { Like } from './like';

export class Post extends Model {
  public id!: string;
  public content?: string;
  public image_url?: string;
  public video_url?: string;
  public guest_id!: string;
  public wedding_event_id!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations
  public guest?: Guest;
  public likes?: Like[];
  public comments?: Comment[];
}

Post.init({
  id: { type: DataTypes.STRING(191), primaryKey: true },
  content: { type: DataTypes.TEXT },
  image_url: { type: DataTypes.STRING },
  video_url: { type: DataTypes.STRING },
  guest_id: { type: DataTypes.STRING(191), allowNull: false },
  wedding_event_id: { type: DataTypes.STRING(191), allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'post',
  tableName: 'posts',
  timestamps: false
});
