/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateLeadDto } from './dto/create-lead.dto';
import { Lead } from '../entity/lead.entity';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  async create_lead(dto: CreateLeadDto) {
    try {
      const leadData = {
        clientName: dto.clientName,
        phone: dto.phone,
        source: dto.source,
        status: 'new',
        createdByUserId: dto.createdByUserId,
        notes: '',
      }

      const createlead = this.leadRepository.create(leadData);
      await this.leadRepository.save(createlead);
      return { message: 'Lead created successfully' };
    } catch (error) {
      console.log(error);
      return { message: 'Failed to create lead' };
    }
  }
  async my_leads(userId: string) {
    try {
      const leads = await this.leadRepository.find({
        where: { createdByUserId: userId },
      });
      return leads;
    } catch (error) {
      console.log(error);
      return { message: 'Failed to get leads' };
    }
  }

  async all_leads() {
    try {
      const leads = await this.leadRepository.find();
      return leads;
    } catch (error) {
      console.log(error);
      return { message: 'Failed to get leads' };
    }
  }

  async assign_lead(leadId: string, update: 'get' | 'update' | 'delete' , status?: 'new' | 'assigned' | 'converted' | 'lost', notes?: string) {
    try {
      const lead = await this.leadRepository.findOne({ where: { id: leadId } });
      if (!lead) {
        return { message: 'Lead not found' };
      }
      if (update === 'get') {
        return lead;
      }
      if (update === 'update') {
        if(!status){
          return { message: 'Status is required' };
        }
        lead.status = status;
        if(!notes){
          return { message: 'Notes is required' };
        }
        lead.notes = notes ;
        await this.leadRepository.save(lead);
        return { message: 'Lead updated successfully' };
      }
      if (update === 'delete') {
        await this.leadRepository.remove(lead);
        return { message: 'Lead deleted successfully' };
      }
    } catch (error) {
      console.log(error);
      return { message: 'Failed to assign lead' };
    }
  }
}
