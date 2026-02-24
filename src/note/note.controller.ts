/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { NoteService } from './note.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('manager')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Roles('manager', 'admin')
  @Post('leads/:id/notes')
  createLeadNote(@Param('id') leadId: string, @Body() body: { text: string }, @Request() req) {
    return this.noteService.create(req.user.userId, body.text, leadId, undefined);
  }

  @Roles('manager', 'admin')
  @Get('leads/:id/notes')
  getLeadNotes(@Param('id') leadId: string) {
    return this.noteService.findByLead(leadId);
  }

  @Roles('manager', 'admin')
  @Patch('leads/:id/notes/:noteId')
  updateLeadNote(@Param('noteId') noteId: string, @Body('text') text: string) {
    return this.noteService.update(noteId, text);
  }

  @Roles('manager', 'admin')
  @Post('deals/:id/notes')
  createDealNote(@Param('id') dealId: string, @Body() body: { text: string }, @Request() req) {
    return this.noteService.create(req.user.userId, body.text, undefined, dealId);
  }

  @Roles('manager', 'admin')
  @Get('deals/:id/notes')
  getDealNotes(@Param('id') dealId: string) {
    return this.noteService.findByDeal(dealId);
  }

  @Roles('manager', 'admin')
  @Patch('deals/:id/notes/:noteId')
  updateDealNote(@Param('noteId') noteId: string, @Body('text') text: string) {
    return this.noteService.update(noteId, text);
  }
}
