import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { EventService } from '@/lib/services/eventService';
import { initializeDatabase } from '@/lib/db-init';
import { use } from 'react';

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

    const { primary_color, logo_text, font_name, use_text_logo, logo_url } = await request.json();

    const event = await EventService.getEventById(user.event_id!);
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    // Update event customization
    const updateData: any = { 
      primary_color, 
      name: logo_text, 
      logo_url,
      use_logo_text: use_text_logo,
      font_name
    };
        
    await event.update(updateData);

    return NextResponse.json({ message: 'Customization saved successfully' });
  } catch (error) {
    console.error('Customize event error:', error);
    return NextResponse.json({ message: 'Failed to save customization' }, { status: 500 });
  }
}