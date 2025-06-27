import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { GuestService } from '@/lib/services/guestService';
import { EventService } from '@/lib/services/eventService';
import { sendEmail, generateGuestCredentialsEmail } from '@/lib/email';
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

    const { guestIds, password } = await request.json();
    
    if (!password) {
      return NextResponse.json({ message: 'Wedding password is required' }, { status: 400 });
    }

    // Get the couple's event
    const events = await EventService.getEventsByUserId(user.id);
    if (events.length === 0) {
      return NextResponse.json({ message: 'No event found for this couple' }, { status: 404 });
    }

    const event = events[0]; // Use the first event

    // Get guests
    let guests;
    if (guestIds && guestIds.length > 0) {
      // Send to specific guests
      guests = await GuestService.getGuestsByEventId(event.id);
      guests = guests.filter(g => guestIds.includes(g.id));
    } else {
      // Send to all guests
      guests = await GuestService.getGuestsByEventId(event.id);
    }

    let sent = 0;
    const errors: string[] = [];

    for (const guest of guests) {
      try {
        const emailTemplate = generateGuestCredentialsEmail(
          guest.email!,
          guest.name,
          password, // Use the real password provided by the couple
          event.name,
          event.event_code
        );
        
        await sendEmail(emailTemplate);
        sent++;
      } catch (error) {
        errors.push(`Failed to send invitation to ${guest.name}`);
      }
    }

    return NextResponse.json({ 
      sent,
      errors: errors.length > 0 ? errors : undefined,
      message: `Invitations sent to ${sent} guests`
    });
  } catch (error) {
    console.error('Send invitations error:', error);
    return NextResponse.json({ message: 'Failed to send invitations' }, { status: 500 });
  }
}