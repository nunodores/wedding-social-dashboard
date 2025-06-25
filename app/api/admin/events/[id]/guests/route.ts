import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { initializeDatabase } from '@/lib/db-init';
import { Guest } from '@/lib/model/guest'
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: any) {
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

    const guests = await Guest.findAll({
      where: { wedding_event_id: params.id },
    });

    return NextResponse.json({ guests });
  } catch (error) {
    console.error('Admin guests fetch error:', error);
    return NextResponse.json({ message: 'Failed to fetch guests' }, { status: 500 });
  }
}