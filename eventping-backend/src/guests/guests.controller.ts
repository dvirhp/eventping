import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateGuestDto } from './dto/create-guest.dto';
import { GuestsService } from './guests.service';

@UseGuards(JwtAuthGuard)
@Controller('events/:eventId/guests')
export class GuestsController {
    constructor (private readonly guestsService: GuestsService) {}

    @Post()
    add(@Req() req, @Param('eventId') eventId: string, @Body() dto: CreateGuestDto) {
        return this.guestsService.addGuest(req.user.id, eventId, dto);
    }

    @Get()
    list(@Req() req, @Param('eventId') eventId: string) {
        return this.guestsService.listGuests(req.user.id, eventId);
    }

}
