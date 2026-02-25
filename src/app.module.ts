import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
dotenv.config();
import { LeadModule } from './lead/lead.module';
import { DealModule } from './deal/deal.module';
import { TaskModule } from './task/task.module';
import { NoteModule } from './note/note.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { User } from './entity/user.entity';
import { Lead } from './entity/lead.entity';
import { Deal } from './entity/deal.entity';
import { Note } from './entity/note.entity';
import { Task } from './entity/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      synchronize: true,
      autoLoadEntities: true,
      entities: [User, Lead, Deal, Note, Task],
    }),
    TypeOrmModule.forFeature([User, Lead, Deal]),
    AuthModule,
    LeadModule,
    DealModule,
    TaskModule,
    NoteModule,
  ],
  controllers: [AppController, AdminController],
  providers: [AppService],
})
export class AppModule {}
