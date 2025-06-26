import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { initializeDatabase } from '@/lib/db-init';
import { Event } from '@/lib/model/models';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const event = await Event.findByPk(params.id);
    
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    // Set event status to inactive
    await event.update({ status: 'inactive' });

    return NextResponse.json({ message: 'Access removed successfully' });
  } catch (error) {
    console.error('Remove access error:', error);
    return NextResponse.json({ message: 'Failed to remove access' }, { status: 500 });
  }
}