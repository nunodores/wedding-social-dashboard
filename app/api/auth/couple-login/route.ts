import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { EventService } from '@/lib/services/eventService';
import { UserService } from '@/lib/services/userService';
import { initializeDatabase } from '@/lib/db-init';
import { compare, hash } from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { eventCode, password } = await request.json();

    const event = await EventService.getEventByCode(eventCode);
    if (!event) {
      return NextResponse.json({ message: 'Invalid event code' }, { status: 401 });
    }
    console.log('====================================');
    console.log(event);
    console.log('====================================');
    const user = await UserService.findByEmail(event.user?.email || "");
    console.log('====================================');
    console.log("user");
    console.log(user);
    console.log(user?.password_hash);
    console.log(password);
    
    console.log('====================================');
    const isPasswordValid = await compare(password, user?.password_hash || "");
    console.log(isPasswordValid);
    
    if (!user || !isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }
    console.log('====================================');
    console.log(user.dataValues);
    console.log('====================================');
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      event_id: event.id,
    });

    return NextResponse.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        event_id: event.id,
        name: user.name
      } 
    });
  } catch (error) {
    console.error('Couple login error:', error);
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  }
}