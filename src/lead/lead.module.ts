import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Lead } from 'src/entity/lead.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Lead])],
  controllers: [LeadController],
  providers: [LeadService],
})
export class LeadModule {}
