/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { Lead } from './entity/lead.entity';
import { Deal } from './entity/deal.entity';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Lead) private leadRepository: Repository<Lead>,
    @InjectRepository(Deal) private dealRepository: Repository<Deal>,
  ) {}

  @Roles('admin')
  @Get('users')
  async getAllUsers() {
    return this.userRepository.find();
  }

  @Roles('admin')
  @Patch('users/:id/role')
  async updateUserRole(@Param('id') id: string, @Body('role') role: 'user' | 'manager' | 'admin') {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return { message: 'User not found' };
    user.role = role;
    await this.userRepository.save(user);
    return { message: 'User role updated successfully', user };
  }

  @Roles('admin')
  @Patch('users/:id/status')
  async updateUserStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return { message: 'User not found' };
    user.isActive = isActive;
    await this.userRepository.save(user);
    return { message: `User ${isActive ? 'unblocked' : 'blocked'} successfully`, user };
  }

  @Roles('admin')
  @Get('stats')
  async getGlobalStats() {
    const totalUsers = await this.userRepository.count();
    const totalLeads = await this.leadRepository.count();
    const totalDeals = await this.dealRepository.count();

    const { sum } = await this.dealRepository
      .createQueryBuilder('deal')
      .select('SUM(deal.amount)', 'sum')
      .getRawOne();

    return {
      totalUsers,
      totalLeads,
      totalDeals,
      totalDealAmount: sum || 0,
    };
  }
}
