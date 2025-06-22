import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateEventCode } from '@/lib/auth';
import { UserService } from '@/lib/services/userService';
import { EventService } from '@/lib/services/eventService';
import { UserRole } from '@/lib/models/User';
import { sendEmail, generateCoupleCredentialsEmail } from '@/lib/email';
import { initializeDatabase } from '@/lib/db-init';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { eventName, coupleEmail, groomName, brideName, eventDate, description } = await request.json();

    // Generate password for couple
    const password = Math.random().toString(36).substring(2, 12);

    // Create couple user
    const coupleUser = await UserService.createUser({
      email: coupleEmail,
      password: password,
      role: UserRole.COUPLE,
      name: `${groomName} & ${brideName}`,
    });

    // Create event
    const event = await EventService.createEvent({
      name: eventName,
      couple_user_id: coupleUser.dataValues.id,
      event_date: eventDate,
      description: description || '',
    });

    // Send credentials email
    const emailTemplate = generateCoupleCredentialsEmail(
      coupleEmail,
      event.dataValues.event_code,
      password,
      eventName
    );

    await sendEmail(emailTemplate);

    return NextResponse.json({ 
      message: 'Event created successfully',
      eventCode: event.dataValues.event_code,
      eventId: event.dataValues.id
    });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ message: 'Failed to create event' }, { status: 500 });
  }
}