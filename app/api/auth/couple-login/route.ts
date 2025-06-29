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

    const user = await UserService.findByCredentials(email, password, UserRole.COUPLE);
    
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
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
    console.error('Couple login error:', error);
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  }
}