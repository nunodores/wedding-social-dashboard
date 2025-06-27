import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { GuestService } from '@/lib/services/guestService';
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

    // Get the couple's event
    const events = await EventService.getEventsByUserId(user.id);
    if (events.length === 0) {
      return NextResponse.json({ message: 'No event found for this couple' }, { status: 404 });
    }

    const event = events[0]; // Use the first event

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    // Read file content
    const content = await file.text();
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return NextResponse.json({ message: 'File must contain header and at least one guest' }, { status: 400 });
    }

    // Parse CSV/Excel content
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const nameIndex = headers.findIndex(h => h.includes('name'));
    const emailIndex = headers.findIndex(h => h.includes('email'));
    const phoneIndex = headers.findIndex(h => h.includes('phone'));

    if (nameIndex === -1 || emailIndex === -1) {
      return NextResponse.json({ message: 'File must contain Name and Email columns' }, { status: 400 });
    }

    let imported = 0;
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length < Math.max(nameIndex, emailIndex) + 1) {
        continue;
      }

      const name = values[nameIndex];
      const email = values[emailIndex];
      const phone = phoneIndex >= 0 ? values[phoneIndex] : undefined;

      if (!name || !email) {
        errors.push(`Row ${i + 1}: Missing name or email`);
        continue;
      }

      try {
        // Generate username and password
        const password = Math.random().toString(36).substring(2, 10);

        const guest = await GuestService.createGuest({
          id: crypto.randomUUID(),
          wedding_event_id: event.id,
          name,
          email,
          phone,
          password,
        });

        imported++;
      } catch (error) {
        console.log('Guest creation error:', error);
        errors.push(`Row ${i + 1}: Failed to create guest`);
      }
    }

    return NextResponse.json({ 
      imported,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully imported ${imported} guests`
    });
  } catch (error) {
    console.error('Guest import error:', error);
    return NextResponse.json({ message: 'Failed to import guests' }, { status: 500 });
  }
}