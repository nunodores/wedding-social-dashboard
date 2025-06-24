import {  EventStatus } from '../models/Event';
import { generateEventCode } from '../auth';
import { Guest, Post, User,Event} from '../model/models';

export class EventService {
  static async getAllEvents(): Promise<Event[]> {
    return await Event.findAll({
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

  static async getEventsByUserId(userId: number): Promise<Event[]> {
    return await Event.findAll({
      where: { couple_user_id: userId },
      include: [
        {
          model: Guest,
        },
        {
          model: Post,
        },
      ],
    });
  }

  static async createEvent(eventData: {
    name: string;
    couple_user_id: number;
    event_date?: string;
    description?: string;
  }): Promise<Event> {
    const event_code = generateEventCode();
    
    return await Event.create({
      ...eventData,
      event_code,
      status: EventStatus.ACTIVE,
    });
  }

  static async getAdminStats(): Promise<{
    totalEvents: number;
    activeEvents: number;
    totalGuests: number;
    totalPhotos: number;
  }> {
    const totalEvents = await Event.count();
    const activeEvents = await Event.count({ where: { status: EventStatus.ACTIVE } });
    const totalGuests = await Guest.count();
    const totalPhotos = await Post.count({ where: { image_url: { [require('sequelize').Op.ne]: null } } });

    return {
      totalEvents,
      activeEvents,
      totalGuests,
      totalPhotos,
    };
  }
}