import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cloudinary } from '@/lib/cloudinary';
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

    // Get the couple's event
    const events = await EventService.getEventsByUserId(user.id);
    if (events.length === 0) {
      return NextResponse.json({ logos: [] });
    }

    const event = events[0]; // Use the first event

    // Get all logos for this event from Cloudinary
    const folderPath = `wedding-app/${event.id}/logos`;
    
    try {
      const result = await cloudinary.search
        .expression(`folder:${folderPath}`)
        .sort_by('created_at', 'desc')
        .max_results(50)
        .execute();

      const logos = result.resources.map((resource: any) => ({
        public_id: resource.public_id,
        url: resource.secure_url,
        created_at: resource.created_at,
        width: resource.width,
        height: resource.height,
        format: resource.format,
        bytes: resource.bytes
      }));

      return NextResponse.json({ logos });
    } catch (cloudinaryError) {
      // If folder doesn't exist or no images, return empty array
      return NextResponse.json({ logos: [] });
    }
  } catch (error) {
    console.error('Get logos error:', error);
    return NextResponse.json({ message: 'Failed to fetch logos' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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

    const { public_id } = await request.json();

    if (!public_id) {
      return NextResponse.json({ message: 'Public ID is required' }, { status: 400 });
    }

    // Verify the logo belongs to this event
    const folderPath = `wedding-app/${event.id}/logos`;
    if (!public_id.startsWith(folderPath)) {
      return NextResponse.json({ message: 'Unauthorized to delete this logo' }, { status: 403 });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(public_id);

    return NextResponse.json({ message: 'Logo deleted successfully' });
  } catch (error) {
    console.error('Delete logo error:', error);
    return NextResponse.json({ message: 'Failed to delete logo' }, { status: 500 });
  }
}