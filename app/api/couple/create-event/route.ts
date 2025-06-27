import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateEventCode } from '@/lib/auth';
import { EventService } from '@/lib/services/eventService';
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
    if (!user || user.role !== 'couple') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { eventName, groomName, brideName, eventDate, description } = await request.json();

    // Create event for the couple
    const event = await EventService.createEvent({
      name: eventName,
      couple_user_id: user.id,
      event_date: eventDate,
      description: description || '',
    });

    return NextResponse.json({ 
      message: 'Event created successfully',
      event: {
        id: event.id,
        name: event.name,
        event_code: event.event_code,
        primary_color: event.primary_color,
        event_date: event.event_date,
        description: event.description,
      }
    });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ message: 'Failed to create event' }, { status: 500 });
  }
}