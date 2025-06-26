import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { EventService } from '@/lib/services/eventService';
import { initializeDatabase } from '@/lib/db-init';
import { Event } from '@/lib/model/models';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const event = await EventService.getEventById(params.id);

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    const eventAllData = await EventService.addMoreDataToEventObj(event);
    return NextResponse.json({ eventAllData });
  } catch (error) {
    console.error('Admin event fetch error:', error);
    return NextResponse.json({ message: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { name, event_date, description, primary_color, status } = await request.json();

    const event = await Event.findByPk(params.id);
    
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    // Update event
    await event.update({
      name,
      event_date,
      description,
      primary_color,
      status,
    });

    return NextResponse.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Admin event update error:', error);
    return NextResponse.json({ message: 'Failed to update event' }, { status: 500 });
  }
}