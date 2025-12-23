import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { EventsModule } from './events/events.module';
import { GuestsModule } from './guests/guests.module';

@Module({
  imports: [UsersModule, AuthModule, EventsModule, GuestsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
