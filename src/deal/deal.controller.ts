import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { DealService } from './deal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @Roles('manager', 'admin')
  @Post('manager/leads/:id/convert-to-deal')
  convertToDeal(@Param('id') leadId: string, @Body('amount') amount?: number) {
    return this.dealService.convertToDeal(leadId, amount);
  }

  @Roles('manager', 'admin')
  @Get('manager/deals')
  getManagerDeals(@Request() req) {
    return this.dealService.findAll();
  }

  @Roles('manager', 'admin')
  @Get('manager/deals/:id')
  getManagerDealById(@Param('id') id: string) {
    return this.dealService.findOne(id);
  }

  @Roles('manager', 'admin')
  @Patch('manager/deals/:id')
  updateManagerDeal(@Param('id') id: string, @Body() updateData: any) {
    return this.dealService.update(id, updateData);
  }

  @Roles('manager', 'admin')
  @Patch('manager/deals/:id/stage')
  updateDealStage(@Param('id') id: string, @Body('stage') stage: string) {
    return this.dealService.updateStage(id, stage);
  }

  @Roles('manager', 'admin')
  @Post('manager/deals/:id/close')
  closeDeal(@Param('id') id: string, @Body('status') status: 'won' | 'lost') {
    return this.dealService.closeDeal(id, status);
  }

  @Roles('admin')
  @Get('admin/deals')
  getAllDeals() {
    return this.dealService.findAll();
  }

  @Roles('admin')
  @Patch('admin/deals/:id/status')
  adminUpdateDealStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.dealService.updateStage(id, status);
  }
}
