import { Module } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { RsvpController } from './rsvp.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [GuestsService, PrismaService],
  controllers: [GuestsController, RsvpController]
})
export class GuestsModule {}
