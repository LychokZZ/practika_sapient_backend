import { Controller, Get, Post, Body } from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Controller('lead')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post('create_lead')
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadService.create_lead(createLeadDto);
  }

  @Get('my_leads')
  my_leads(@Body() userId: string) {
    return this.leadService.my_leads(userId);
  }
}
