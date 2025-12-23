import { Controller, Post, Param, Body } from "@nestjs/common";
import { GuestsService } from "./guests.service";

@Controller('rsvp')
export class RsvpController {
    constructor (private readonly guestsService: GuestsService) {}

    @Post(':token')
    confirm(@Param('token') token: string, @Body('message') message: string) {
        return this.guestsService.confirmByToken(token, message);
    }
}