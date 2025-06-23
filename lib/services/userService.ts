import { hashPassword, comparePassword } from '../auth';
import { User } from '../model/models';
import { UserRole } from '../models/User';

export class UserService {
  static async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  static async findByCredentials(email: string, password: string, role?: UserRole): Promise<User | null> {
    const user = await User.findOne({ 
      where: { 
        email,
        ...(role && { role })
      } 
    });

    if (user && await comparePassword(password, user.password_hash)) {
      return user;
    }

    return null;
  }

  static async createUser(userData: {
    email: string;
    password: string;
    role: UserRole;
    name?: string;
  }): Promise<User> {
    const password_hash = await hashPassword(userData.password);
    
    return await User.create({
      email: userData.email,
      password_hash,
      role: userData.role,
      name: userData.name,
    });
  }

  static async createAdminUser(): Promise<User | null> {
    try {
      const existingAdmin = await User.findOne({ 
        where: { 
          email: 'admin@weddingplatform.com',
          role: UserRole.ADMIN 
        } 
      });

      if (existingAdmin) {
        return existingAdmin;
      }

      return await this.createUser({
        email: 'admin@weddingplatform.com',
        password: 'admin123',
        role: UserRole.ADMIN,
        name: 'Platform Admin',
      });
    } catch (error) {
      console.error('Error creating admin user:', error);
      return null;
    }
  }
}