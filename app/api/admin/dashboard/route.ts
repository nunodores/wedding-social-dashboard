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
    
    // Get simplified stats (only total and active events)
    const stats = {
      totalEvents: events.length,
      activeEvents: events.filter(event => event.status === 'active').length,
    };

    return NextResponse.json({
      events,
      stats,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({ message: 'Failed to fetch dashboard' }, { status: 500 });
  }
}