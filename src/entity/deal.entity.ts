/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('deals')
export class Deal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    leadId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    amount: number;

    @Column({ default: 'negotiation' })
    stage: string;

    @Column({ nullable: true })
    closeDate: Date;

    @CreateDateColumn()
    createdAt: Date;
}
