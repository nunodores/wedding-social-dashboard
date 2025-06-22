import 'reflect-metadata';
import { sequelize } from './model/models';

export async function initializeDatabase(): Promise<void> {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await sequelize.sync(); // ✅ One-time sync only
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}