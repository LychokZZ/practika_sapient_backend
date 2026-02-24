/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, UseGuards, Request, Patch, Param } from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Roles('user', 'manager', 'admin')
  @Post('user_lead/create_lead')
  create(@Body() createLeadDto: CreateLeadDto, @Request() req) {
    createLeadDto.createdByUserId = req.user.userId;
    return this.leadService.create_lead(createLeadDto);
  }

  @Roles('user', 'manager', 'admin')
  @Get('user_lead/my')
  my_leads(@Request() req) {
    return this.leadService.my_leads(req.user.userId);
  }

  @Roles('user', 'manager', 'admin')
  @Get('user_lead/:id')
  async getMyLead(@Param('id') id: string, @Request() req) {
    return this.leadService.getLeadForUser(id, req.user.userId);
  }

  @Roles('manager', 'admin')
  @Get('manager/users')
  getManagerUsers(@Request() req) {
    return [{ id: 'some-user-id', name: 'Mock User' }];
  }

  @Roles('manager', 'admin')
  @Get('manager/leads/:id')
  getLeadForManager(@Param('id') id: string) {
    return this.leadService.assign_lead(id, 'get');
  }

  @Roles('manager', 'admin')
  @Patch('manager/leads/:id/status')
  updateLeadStatus(@Param('id') id: string, @Body('status') status: 'new'|'assigned'|'converted'|'lost', @Body('notes') notes: string) {
    return this.leadService.assign_lead(id, 'update', status, notes);
  }

  @Roles('admin')
  @Get('admin/leads')
  getAllLeads() {
    return this.leadService.all_leads();
  }

  @Roles('admin')
  @Patch('admin/leads/:id/assign')
  assignLeadToManager(@Param('id') id: string, @Body('assignedToUserId') assignedToUserId: string) {
    return this.leadService.reassign_lead(id, assignedToUserId);
  }

  @Roles('admin')
  @Patch('admin/leads/:id/status')
  adminUpdateLeadStatus(@Param('id') id: string, @Body('status') status: 'new'|'assigned'|'converted'|'lost', @Body('notes') notes: string) {
    return this.leadService.assign_lead(id, 'update', status, notes);
  }
}
