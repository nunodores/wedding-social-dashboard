import { EventStatus } from '../models/Event';
import { generateEventCode, hashPassword } from '../auth';
import { Guest, Post, User, Event } from '../model/models';
import { sequelize } from '../model/models';

export class EventService {
  static async getAllEvents(): Promise<any[]> {
    const events = await Event.findAll({
      include: [
        {
          model: User,
          attributes: ['email'],
        },
      ],
    });

    // Calculate counts for each event
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const [guestCount, postCount, photoCount] = await Promise.all([
          Guest.count({ where: { wedding_event_id: event.id } }),
          Post.count({ where: { wedding_event_id: event.id } }),
          Post.count({ 
            where: { 
              wedding_event_id: event.id,
              image_url: { [require('sequelize').Op.ne]: null }
            }
          })
        ]);

        return {
          id: event.id,
          name: event.name,
          event_code: event.event_code,
          status: event.status,
          event_date: event.event_date,
          couple_email: event.user?.email || '',
          created_at: event.createdAt,
          guest_count: guestCount,
          photos_count: photoCount,
          posts_count: postCount,
        };
      })
    );

    return eventsWithCounts;
  }
  static async getEventById(id: string): Promise<Event | null> {
    return await Event.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['email'],
        },
        {
          model: Guest,
        },
        {
          model: Post,
        },
      ],
    });
  }
  static async addMoreDataToEventObj(event: Event): Promise<any | null> {

    // Calculate counts for this specific event
    const [guestCount, postCount, photoCount] = await Promise.all([
      Guest.count({ where: { wedding_event_id: event.id } }),
      Post.count({ where: { wedding_event_id: event.id } }),
      Post.count({ 
        where: { 
          wedding_event_id: event.id,
          image_url: { [require('sequelize').Op.ne]: null }
        }
      })
    ]);

    return {
      id: event.id,
      name: event.name,
      event_code: event.event_code,
      primary_color: event.primary_color,
      logo_url: event.logo_url,
      couple_email: event.user?.email || '',
      event_date: event.event_date,
      description: event.description,
      status: event.status,
      font_name: event.font_name,
      use_logo_text: event.use_logo_text,
      guest_count: guestCount,
      photos_count: photoCount,
      posts_count: postCount,
      created_at: event.createdAt,
    };
  }

  static async getEventByCode(eventCode: string): Promise<Event | null> {
    return await Event.findOne({
      where: { event_code: eventCode },
      include: [
        {
          model: User,
        },
      ],
    });
  }

  static async getEventsByUserId(userId: number): Promise<any[]> {
    const events = await Event.findAll({
      where: { couple_user_id: userId },
    });

    // Calculate counts for each event
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const [guestCount, postCount, photoCount] = await Promise.all([
          Guest.count({ where: { wedding_event_id: event.id } }),
          Post.count({ where: { wedding_event_id: event.id } }),
          Post.count({ 
            where: { 
              wedding_event_id: event.id,
              image_url: { [require('sequelize').Op.ne]: null }
            }
          })
        ]);

        return {
          ...event.dataValues,
          guest_count: guestCount,
          photos_count: photoCount,
          posts_count: postCount,
        };
      })
    );

    return eventsWithCounts;
  }

  static async createEvent(eventData: {
    name: string;
    couple_user_id: number;
    event_date?: string;
    description?: string;
  }): Promise<Event> {
    const event_code = generateEventCode();
    const hashed_password = await hashPassword('default_password');
    
    return await Event.create({
      id: require('crypto').randomUUID(),
      ...eventData,
      event_code,
      status: EventStatus.ACTIVE,
      hashed_password,
      primary_color: '#d946ef',
      font_name: 'font-playfair',
      use_logo_text: true,
    });
  }

  static async getAdminStats(): Promise<{
    totalEvents: number;
    activeEvents: number;
    totalGuests: number;
    totalPhotos: number;
  }> {
    const [totalEvents, activeEvents, totalGuests, totalPhotos] = await Promise.all([
      Event.count(),
      Event.count({ where: { status: EventStatus.ACTIVE } }),
      Guest.count(),
      Post.count({ 
        where: { 
          image_url: { [require('sequelize').Op.ne]: null }
        }
      })
    ]);

    return {
      totalEvents,
      activeEvents,
      totalGuests,
      totalPhotos,
    };
  }
}