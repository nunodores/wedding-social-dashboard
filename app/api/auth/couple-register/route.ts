import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { UserService } from '@/lib/services/userService';
import { UserRole } from '@/lib/models/User';
import { initializeDatabase } from '@/lib/db-init';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { email, password, name } = await request.json();

    // Check if user already exists
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return NextResponse.json({ message: 'An account with this email already exists' }, { status: 400 });
    }

    // Create new couple user
    const user = await UserService.createUser({
      email,
      password,
      role: UserRole.COUPLE,
      name,
    });

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
      },
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Couple registration error:', error);
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
  }
}