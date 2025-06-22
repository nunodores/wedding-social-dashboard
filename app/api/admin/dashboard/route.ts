import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { EventService } from '@/lib/services/eventService';
import { initializeDatabase } from '@/lib/db-init';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

    const events = await EventService.getAllEvents();
    const stats = await EventService.getAdminStats();

    // Transform events to include computed fields
    const transformedEvents = events.map(event => ({
      id: event.id,
      name: event.name,
      event_code: event.event_code,
      status: event.status,
      couple_email: event.couple_email,
      created_at: event.created_at,
      guest_count: event.guest_count,
      photos_count: event.photos_count,
      posts_count: event.posts_count,
    }));

    return NextResponse.json({
      events: transformedEvents,
      stats,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({ message: 'Failed to fetch dashboard' }, { status: 500 });
  }
}