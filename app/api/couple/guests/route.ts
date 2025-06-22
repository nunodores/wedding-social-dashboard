import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { GuestService } from '@/lib/services/guestService';
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

    const guests = await GuestService.getGuestsByEventId(user.event_id!);

    return NextResponse.json({ guests });
  } catch (error) {
    console.error('Couple guests fetch error:', error);
    return NextResponse.json({ message: 'Failed to fetch guests' }, { status: 500 });
  }
}