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
    if (!user || user.role !== 'couple') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Get events for this couple
    const events = await EventService.getEventsByUserId(user.id);
    
    if (events.length === 0) {
      // No events found - couple needs to create their first event
      return NextResponse.json({ 
        hasEvent: false,
        message: 'No events found. Please create your first event.'
      });
    }

    // For now, we'll use the first event (couples typically have one main event)
    const event = events[0];
    const eventAllData = await EventService.addMoreDataToEventObj(event);

    // Return the event with calculated counts
    const transformedEvent = {
      id: event.id,
      name: event.name,
      event_code: event.event_code,
      primary_color: event.primary_color,
      logo_url: event.logo_url,
      font_name: event.font_name,
      use_logo_text: event.use_logo_text,
      guest_count: eventAllData.guest_count,
      photos_count: eventAllData.photos_count,
      posts_count: eventAllData.posts_count,
      event_date: event.event_date,
      description: event.description,
    };

    return NextResponse.json({ 
      hasEvent: true,
      event: transformedEvent 
    });
  } catch (error) {
    console.error('Couple dashboard error:', error);
    return NextResponse.json({ message: 'Failed to fetch dashboard' }, { status: 500 });
  }
}