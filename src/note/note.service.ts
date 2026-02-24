import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../entity/note.entity';

@Injectable()
export class NoteService {
    constructor(
        @InjectRepository(Note)
        private noteRepository: Repository<Note>,
    ) {}

    async create(authorUserId: string, text: string, leadId?: string, dealId?: string) {
        const note = this.noteRepository.create({
            authorUserId,
            text,
            leadId,
            dealId,
        });
        await this.noteRepository.save(note);
        return { message: 'Note created successfully', note };
    }

    async findByLead(leadId: string) {
        return this.noteRepository.find({ where: { leadId } });
    }

    async findByDeal(dealId: string) {
        return this.noteRepository.find({ where: { dealId } });
    }

    async update(id: string, text: string) {
        const note = await this.noteRepository.findOne({ where: { id } });
        if (!note) throw new NotFoundException('Note not found');
        
        note.text = text;
        await this.noteRepository.save(note);
        
        return { message: 'Note updated successfully', note };
    }
}

