import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealService } from './deal.service';
import { DealController } from './deal.controller';
import { Deal } from '../entity/deal.entity';
import { Lead } from '../entity/lead.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deal, Lead])],
  controllers: [DealController],
  providers: [DealService],
})
export class DealModule {}
