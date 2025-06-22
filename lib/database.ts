import { Sequelize } from 'sequelize';
if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sequelize = new Sequelize(process.env.NEXT_PUBLIC_DATABASE_URL, {
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: false,
  dialectOptions: {
    ssl: false,
    connectTimeout: 60000,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
});
import { DataTypes, Model } from 'sequelize';


// // User Model (Admin and Couple)
// export class User extends Model {
//   public id!: number;
//   public email!: string;
//   public password_hash!: string;
//   public role!: 'admin' | 'couple';
//   public name?: string;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// User.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     email: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//       unique: true,
//     },
//     password_hash: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     role: {
//       type: DataTypes.ENUM('admin', 'couple'),
//       allowNull: false,
//     },
//     name: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//     },
//   },
//   {
//     sequelize,
//     tableName: 'users',
//     timestamps: true,
//     underscored: true,
//   }
// );

// // Event Model (Wedding Events managed by couples)
// export class Event extends Model {
//   public id!: number;
//   public name!: string;
//   public event_code!: string;
//   public couple_user_id!: number;
//   public event_date?: Date;
//   public description?: string;
//   public primary_color!: string;
//   public logo_url?: string;
//   public hashedPassword!: string;
//   public status!: 'active' | 'inactive' | 'completed';
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;

//   // Virtual fields for counts
//   public guest_count?: number;
//   public photos_count?: number;
//   public posts_count?: number;
//   public couple_email?: string;

//   // Associations
//   public couple?: User;
//   public payments?: Payment[];
// }

// Event.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     event_code: {
//       type: DataTypes.STRING(20),
//       allowNull: false,
//       unique: true,
//     },
//     couple_user_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: User,
//         key: 'id',
//       },
//     },
//     event_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: true,
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     primary_color: {
//       type: DataTypes.STRING(7),
//       allowNull: false,
//       defaultValue: '#d946ef',
//     },
//     logo_url: {
//       type: DataTypes.STRING(500),
//       allowNull: true,
//     },
//     status: {
//       type: DataTypes.ENUM('active', 'inactive', 'completed'),
//       allowNull: false,
//       defaultValue: 'active',
//     },
//     hashedPassword: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     }
//   },
//   {
//     sequelize,
//     tableName: 'events',
//     timestamps: true,
//     underscored: true,
//   }
// );


// // Payment Model
// export class Payment extends Model {
//   public id!: number;
//   public event_id!: number;
//   public stripe_payment_intent_id?: string;
//   public amount!: number;
//   public currency!: string;
//   public status!: 'pending' | 'completed' | 'failed' | 'refunded';
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;

//   // Associations
//   public event?: Event;
// }

// Payment.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     event_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: Event,
//         key: 'id',
//       },
//     },
//     stripe_payment_intent_id: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//     },
//     amount: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//     },
//     currency: {
//       type: DataTypes.STRING(3),
//       allowNull: false,
//       defaultValue: 'USD',
//     },
//     status: {
//       type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
//       allowNull: false,
//       defaultValue: 'pending',
//     },
//   },
//   {
//     sequelize,
//     tableName: 'payments',
//     timestamps: true,
//     underscored: true,
//   }
// );
// export class WeddingEvent extends Model {
//   public id!: string;
//   public name!: string;
//   public slug!: string;
//   public hashedPassword!: string;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// WeddingEvent.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     slug: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     hashedPassword: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     tableName: 'wedding_events',
//   }
// );
// export class Guest extends Model {
//   public id!: string;
//   public name!: string;
//   public email!: string;
//   public hashedPassword!: string;
//   public avatar_url?: string;
//   public fcm_token?: string;
//   public wedding_event_id!: string;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// Guest.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     hashedPassword: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     avatar_url: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     fcm_token: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     wedding_event_id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: Event,
//         key: 'id',
//       },
//     },
//   },
//   {
//     sequelize,
//     tableName: 'guests',
//   }
// );

// // Post Model
// export class Post extends Model {
//   public id!: string;
//   public content?: string;
//   public image_url?: string;
//   public video_url?: string;
//   public guest_id!: string;
//   public wedding_event_id!: string;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// Post.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     image_url: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     video_url: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     guest_id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: Guest,
//         key: 'id',
//       },
//     },
//     wedding_event_id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: Event,
//         key: 'id',
//       },
//     },
//   },
//   {
//     sequelize,
//     tableName: 'posts',
//   }
// );
// export class Comment extends Model {
//   public id!: string;
//   public content!: string;
//   public guest_id!: string;
//   public post_id!: string;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// Comment.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     guest_id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: Guest,
//         key: 'id',
//       },
//     },
//     post_id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: Post,
//         key: 'id',
//       },
//     },
//   },
//   {
//     sequelize,
//     tableName: 'comments',
//   }
// );

// export class Like extends Model {
//   public id!: string;
//   public guest_id!: string;
//   public post_id!: string;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// Like.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     guest_id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: Guest,
//         key: 'id',
//       },
//     },
//     post_id: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: Post,
//         key: 'id',
//       },
//     },
//   },
//   {
//     sequelize,
//     tableName: 'likes',
//     indexes: [
//       {
//         unique: true,
//         fields: ['guest_id', 'post_id'],
//       },
//     ],
//   }
// );

// // Define Associations
// User.hasMany(Event, { foreignKey: 'couple_user_id'});
// Event.belongsTo(User, { foreignKey: 'couple_user_id'});

// Event.hasMany(Payment, { foreignKey: 'event_id'});
// Payment.belongsTo(Event, { foreignKey: 'event_id'});

// Event.hasMany(Guest, { foreignKey: 'wedding_event_id'});
// Guest.belongsTo(Event, { foreignKey: 'wedding_event_id'});

// Event.hasMany(Post, { foreignKey: 'wedding_event_id' });
// Post.belongsTo(Event, { foreignKey: 'wedding_event_id' });

// Guest.hasMany(Like, { foreignKey: 'guest_id' });
// Like.belongsTo(Guest, { foreignKey: 'guest_id' });

// Post.hasMany(Comment, { foreignKey: 'post_id' });
// Comment.belongsTo(Post, { foreignKey: 'post_id' });

// Post.hasMany(Like, { foreignKey: 'post_id' });
// Like.belongsTo(Post, { foreignKey: 'post_id' });

// Guest.hasMany(Post, { foreignKey: 'guest_id' });
// Post.belongsTo(Guest, { foreignKey: 'guest_id' });

export default sequelize;