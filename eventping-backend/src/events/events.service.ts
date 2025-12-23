import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client/extension';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { title } from 'process';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
    constructor( private readonly prisma: PrismaService ) {}

    async create (ownerId: string, dto: CreateEventDto) {
        return this.prisma.event.create({
            data: {
                title: dto.title,
                description: dto.description,
                date: new Date(dto.date),
                ownerId,
            },
        });
    }

    async findAllForUser(ownerId: string) {
        return this.prisma.event.findMany({
            where: { ownerId },
            orderBy: { date: 'asc' },
        });

    }

    async findOneForUser(ownerId: string, eventId: string) {
        const event = this.prisma.event.findUnique({
            where: { id: eventId },
        });

        if(!event) {
            throw new NotFoundException('Event not found');
        }
        if( event.userId !==ownerId ) {
            throw new ForbiddenException('Access to resource denied');
        }

        return event;
    }

    async updateForUser ( ownerId: string, eventId: string, dto: UpdateEventDto ) {
        await this.findOneForUser(ownerId, eventId);

        return this.prisma.event.update({
            where: { id: eventId },
            data: {
                title: dto.title,
                description: dto.description,
                date: dto.date ? new Date(dto.date) : undefined,
            },
        });     
    }

    async removeForUser ( ownerId: string, eventId: string ) {
        await this.findOneForUser(ownerId, eventId);

        await this.prisma.event.delete({
            where: { id: eventId },
        });

        return { deleted: true };
    }   

    async getStatsForEvent ( ownerId: string, eventId: string ) {
        await this.findOneForUser(ownerId, eventId);

        const totalGuests = await this.prisma.guest.count({
            where: { eventId },
        });

        const confirmed = await this.prisma.guest.count({
            where: { eventId, status: 'CONFIRMED' },
        });

        const declined = await this.prisma.guest.count({
            where: { eventId, status: 'DECLINED' },
        });

        const pending = await this.prisma.guest.count({
            where: { eventId, status: 'PENDING' },
        });

        return {
            totalGuests,
            confirmed,
            declined,
            pending
        };
    }
}