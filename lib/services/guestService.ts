
import { hashPassword } from '../auth';
import { Guest } from '../model/models';
import { Event } from '../model/models';

export class GuestService {
  static async getGuestsByEventId(eventId: string): Promise<Guest[]> {
    return await Guest.findAll({
      where: { wedding_event_id: eventId },
      include: [
        {
          model: Event,
          as: 'event',
        },
      ],
    });
  }

  static async createGuest(guestData: {
    id: string,
    wedding_event_id: string;
    name: string;
    email?: string;
    phone?: string;
    password: string;
  }): Promise<Guest> {
    const { password, ...dataWithoutPassword } = guestData;

    const hashed_password = await hashPassword(password);
    console.log('====================================');
    console.log({
      ...dataWithoutPassword,
      hashed_password,
    });
    console.log('====================================');
    return await Guest.create({
      ...dataWithoutPassword,
      hashed_password,
    });
  }

  static async findGuestByCredentials(
    eventCode: string, 
    username: string, 
    password: string
  ): Promise<Guest | null> {
    const event = await Event.findOne({ where: { event_code: eventCode } });
    if (!event) return null;

    const guest = await Guest.findOne({
      where: {
        wedding_event_id: event.id,
        username,
      },
    });

    if (guest && await require('bcryptjs').compare(password, guest.hashed_password)) {
      return guest;
    }

    return null;
  }
}