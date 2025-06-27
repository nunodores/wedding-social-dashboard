import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { EventService } from '@/lib/services/eventService';
import { initializeDatabase } from '@/lib/db-init';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
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

    const { name, event_date, description } = await request.json();

    // Get the couple's event
    const events = await EventService.getEventsByUserId(user.id);
    if (events.length === 0) {
      return NextResponse.json({ message: 'No event found for this couple' }, { status: 404 });
    }

    const event = events[0]; // Use the first event

    // Update event details
    await event.update({
      name,
      event_date: event_date || null,
      description: description || null,
    });

    return NextResponse.json({ message: 'Event details updated successfully' });
  } catch (error) {
    console.error('Update event details error:', error);
    return NextResponse.json({ message: 'Failed to update event details' }, { status: 500 });
  }
}