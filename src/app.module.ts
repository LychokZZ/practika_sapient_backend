import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import 'dotenv/config';
import { LeadModule } from './lead/lead.module';
import { DealModule } from './deal/deal.module';
import { TaskModule } from './task/task.module';
import { NoteModule } from './note/note.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      synchronize: true,
    }),
    AuthModule,
    LeadModule,
    DealModule,
    TaskModule,
    NoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
