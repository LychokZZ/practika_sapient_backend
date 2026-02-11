/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'jsonwebtoken';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly jwtService: JwtService,
    ) {}
    
    async generateTokens(user: { id: string; email: string }) {
        try {
            const payload: JwtPayload = { sub: user.id, email: user.email };

            const [accessToken, refreshToken] = await Promise.all([
                this.jwtService.signAsync(payload, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '15m',
                }),
                this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '30d',
                }),
            ]);
            return { accessToken, refreshToken };
        } catch (error) {
            throw new Error(error);
        }
    }
    async register(dto: RegisterDto) {
        try {
            const exitsEmail = await this.userRepository.findOne({ where: { email: dto.email } })
            if (exitsEmail) throw new BadRequestException('User with this email already exists');

            const exitsUser = await this.userRepository.findOne({ where: { fullName: dto.fullName } })
            if (exitsUser) throw new BadRequestException('User with this username already exists');


            const hashPassword = await bcrypt.hash(dto.password, 10);
            const user = this.userRepository.create({
                fullName: dto.fullName,
                email: dto.email,
                hashPassword: hashPassword,
                isActive: false,
                role: 'user',
            });
      
            await this.userRepository.save(user);


            const tokens = await this.generateTokens({ id: user.id, email: user.email });
      
            await this.writeRefresh(user.id, tokens.refreshToken);

            const userData = {
                fullName: user.fullName,
                id: user.id,
                email: user.email,
            }
            return { message: 'User registered successfully', tokens, userData};
        } catch (error) {
            throw new Error(error);
        }
    }

    async login(dto: LoginDto) {
        try {
            if (!dto.email) {
                throw new BadRequestException('Email is required');
            }

            const user = await this.userRepository.findOne({
                where: { email: dto.email },
            });

            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const isPasswordMatch = await bcrypt.compare(dto.password, user.hashPassword)
            if (!isPasswordMatch) throw new UnauthorizedException('Invalid password');
      
            const tokens = await this.generateTokens({ id: user.id, email: user.email });
            await this.writeRefresh(user.id, tokens.refreshToken);

            const userData = {
                fullName: user.fullName,
                id: user.id,
                email: user.email, 
            }

            return { message: 'User logged in successfully', tokens, userData};
        } catch (error) {
            throw new Error(error);
        }
    }

    async logout(userId: string) {
        if (!userId) return;
        await this.userRepository.update(
            { id: userId },
            { hashRefreshToken: '' }
        );
    }



    async refresh(refreshToken: string) {
        if (!refreshToken) throw new UnauthorizedException('No refresh token');
        let payload: JwtPayload;
        try {
            payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const user = await this.userRepository.findOne({ where: { id: payload.sub } });
        if (!user || !user.hashRefreshToken) throw new UnauthorizedException('User not found');

        const ok = await bcrypt.compare(refreshToken, user.hashRefreshToken);
        if (!ok) throw new UnauthorizedException('Refresh token mismatch');

        const tokens = await this.generateTokens({ id: user.id, email: user.email });
        await this.writeRefresh(user.id, tokens.refreshToken);

        const userData = { fullName: user.fullName, id: user.id, email: user.email };
        return { message: 'User refresh token successfully', tokens, userData };
    }


    async writeRefresh(userId: string, refreshToken: string) {
        const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(userId, { hashRefreshToken });
    }
}
