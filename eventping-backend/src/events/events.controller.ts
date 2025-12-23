import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    create(@Req() req, @Body() dto: CreateEventDto) {
        return this.eventsService.create(req.user.id, dto);
    }

    @Get()
    findAll(@Req() req) {
        return this.eventsService.findAllForUser(req.user.id);
    }

    @Get(':id')
    findOne(@Req() req, @Param('id') id: string) {
        return this.eventsService.findOneForUser(req.user.id, id);
    }

    @Get(':id/stats')
    getStats(@Req() req, @Param('id') id: string) {
        return this.eventsService.getStatsForEvent(req.user.id, id);
    }

    @Patch(':id')
    update(@Req() req, @Param('id') id: string, @Body() dto: UpdateEventDto) {
        return this.eventsService.updateForUser(req.user.id, id, dto);
    }

    @Delete(':id')
    remove(@Req() req, @Param('id') id: string) {
        return this.eventsService.removeForUser(req.user.id, id);
    }
}
