import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class GuestsService {
  constructor(private prisma: PrismaService) {}

  async addGuest(ownerId: string, eventId: string, dto: CreateGuestDto) {

    const event = await this.prisma.event.findUnique({
        where: { id: eventId },
    });

    if( !event || event.ownerId !== ownerId ) {
        throw new ForbiddenException();
    }

    return this.prisma.guest.create({
        data: {
            name: dto.name,
            phone: dto.phone,
            inviteToken: randomUUID(),
            eventId,
        },
    });
  }

  async listGuests(ownerId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
        where: { id: eventId },
    });

    if( !event || event.ownerId !== ownerId ) {
        throw new ForbiddenException();
    }

    return this.prisma.guest.findMany({
        where: { eventId },
    });
  }

  async confirmByToken(token: string, message: string) {
    const status =
        message.toLowerCase() === 'yes'
            ? 'CONFIRMED'
        : message.toLowerCase() === 'no'
            ? 'DECLINED'
            : 'PENDING';

        return this.prisma.guest.update({
            where: { inviteToken: token },
            data: { status },
        });
  }
}