import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { UserService } from '@/lib/services/userService';
import { UserRole } from '@/lib/models/User';
import { initializeDatabase } from '@/lib/db-init';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { email, password } = await request.json();

    const user = await UserService.findByCredentials(email, password, UserRole.ADMIN);
    console.log('====================================');
    console.log(user);
    console.log('====================================');
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  }
}