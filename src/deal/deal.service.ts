import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from '../entity/deal.entity';
import { Lead } from '../entity/lead.entity';

@Injectable()
export class DealService {
    constructor(
        @InjectRepository(Deal)
        private dealRepository: Repository<Deal>,
        @InjectRepository(Lead)
        private leadRepository: Repository<Lead>,
    ) {}

    async convertToDeal(leadId: string, amount: number = 0) {
        const lead = await this.leadRepository.findOne({ where: { id: leadId } });
        if (!lead) throw new NotFoundException('Lead not found');

        if (lead.status === 'converted') {
            return { message: 'Lead is already converted into a deal' };
        }

        const deal = this.dealRepository.create({
            leadId,
            amount,
            stage: 'negotiation',
        });
        
        await this.dealRepository.save(deal);

        lead.status = 'converted';
        await this.leadRepository.save(lead);

        return { message: 'Lead converted to deal successfully', deal };
    }

    async findAll() {
        return this.dealRepository.find();
    }

    async findOne(id: string) {
        const deal = await this.dealRepository.findOne({ where: { id } });
        if (!deal) throw new NotFoundException('Deal not found');
        return deal;
    }

    async update(id: string, updateData: any) {
        const deal = await this.findOne(id);
        Object.assign(deal, updateData);
        await this.dealRepository.save(deal);
        return { message: 'Deal updated successfully', deal };
    }

    async updateStage(id: string, stage: string) {
        const deal = await this.findOne(id);
        deal.stage = stage;
        await this.dealRepository.save(deal);
        return { message: 'Deal stage updated successfully', deal };
    }

    async closeDeal(id: string, status: 'won' | 'lost') {
        const deal = await this.findOne(id);
        deal.stage = status;
        deal.closeDate = new Date();
        await this.dealRepository.save(deal);
        return { message: `Deal closed as ${status}`, deal };
    }
}

