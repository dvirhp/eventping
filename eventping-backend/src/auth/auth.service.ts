import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const user = await this.usersService.create(dto);
        return this.signToken(user.id, user.email);
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if(!user) {
            throw new Error('Invalid credentials');
        }

        const passwordValid = await bcrypt.compare(dto.password, user.password);
        if(!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.signToken(user.id, user.email);
    }

    private async signToken(userId: number, email: string) {
        const payload = { sub: userId, email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}