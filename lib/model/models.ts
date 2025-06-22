
import { User } from './user';
import { Event } from './event';
import { Guest } from './guest';
import { Post } from './post';
import { Comment } from './comment';
import { Like } from './like';
import { Follow } from './follow';
import { Notification } from './notification';
import { Payment } from './payment';
import { Story } from './story';
import sequelize from '../database';

// === ASSOCIATIONS ===

// Events ↔ Users
Event.belongsTo(User, { foreignKey: 'couple_user_id' });
User.hasMany(Event, { foreignKey: 'couple_user_id' });

// Guests ↔ Events
Guest.belongsTo(Event, { foreignKey: 'wedding_event_id' });
Event.hasMany(Guest, { foreignKey: 'wedding_event_id' });

// Posts ↔ Guests ↔ Events
Post.belongsTo(Guest, { foreignKey: 'guest_id' });
Post.belongsTo(Event, { foreignKey: 'wedding_event_id' });
Guest.hasMany(Post, { foreignKey: 'guest_id' });
Event.hasMany(Post, { foreignKey: 'wedding_event_id' });

// Comments ↔ Posts ↔ Guests
Comment.belongsTo(Post, { foreignKey: 'post_id' });
Comment.belongsTo(Guest, { foreignKey: 'guest_id' });
Post.hasMany(Comment, { foreignKey: 'post_id' });
Guest.hasMany(Comment, { foreignKey: 'guest_id' });

// Likes ↔ Posts ↔ Guests
Like.belongsTo(Post, { foreignKey: 'post_id' });
Like.belongsTo(Guest, { foreignKey: 'guest_id' });
Post.hasMany(Like, { foreignKey: 'post_id' });
Guest.hasMany(Like, { foreignKey: 'guest_id' });

// Follows (self-referencing)
Follow.belongsTo(Guest, { foreignKey: 'follower_id', as: 'follower' });
Follow.belongsTo(Guest, { foreignKey: 'following_id', as: 'following' });
Guest.hasMany(Follow, { foreignKey: 'follower_id', as: 'followings' });
Guest.hasMany(Follow, { foreignKey: 'following_id', as: 'followers' });

// Notifications
Notification.belongsTo(Guest, { foreignKey: 'to_guest_id', as: 'to' });
Notification.belongsTo(Guest, { foreignKey: 'from_guest_id', as: 'from' });
Notification.belongsTo(Post, { foreignKey: 'post_id' });
Guest.hasMany(Notification, { foreignKey: 'to_guest_id', as: 'notifications' });

// Payments ↔ Events
Payment.belongsTo(Event, { foreignKey: 'event_id' });
Event.hasMany(Payment, { foreignKey: 'event_id' });

// Stories ↔ Guests ↔ Events
Story.belongsTo(Guest, { foreignKey: 'guest_id' });
Story.belongsTo(Event, { foreignKey: 'wedding_event_id' });
Guest.hasMany(Story, { foreignKey: 'guest_id' });
Event.hasMany(Story, { foreignKey: 'wedding_event_id' });

// === INIT DB ===

export const initModels = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
    await sequelize.sync({ alter: false }); // change to true for development
    console.log('✅ All models were synchronized successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

export {
  sequelize,
  User,
  Event,
  Guest,
  Post,
  Comment,
  Like,
  Follow,
  Notification,
  Payment,
  Story
};
