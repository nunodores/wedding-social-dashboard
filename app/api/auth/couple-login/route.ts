import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { EventService } from '@/lib/services/eventService';
import { UserService } from '@/lib/services/userService';
import { initializeDatabase } from '@/lib/db-init';

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
    console.log(event.dataValues);
    console.log('====================================');
    const user = await UserService.findByEmail(event.dataValues.user.email);
    if (!user || !(await require('bcryptjs').compare(password, user.dataValues.password_hash))) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }
    console.log('====================================');
    console.log(user.dataValues);
    console.log('====================================');
    const token = generateToken({
      id: user.dataValues.id,
      email: user.dataValues.email,
      role: user.dataValues.role,
      event_id: event.dataValues.id,
    });

    return NextResponse.json({ 
      token, 
      user: { 
        id: user.dataValues.id, 
        email: user.dataValues.email, 
        role: user.dataValues.role,
        event_id: event.dataValues.id,
        name: user.dataValues.name
      } 
    });
  } catch (error) {
    console.error('Couple login error:', error);
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  }
}