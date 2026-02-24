/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notes')
export class Note {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    text: string;

    @Column()
    authorUserId: string;

    @Column({ nullable: true })
    leadId: string;

    @Column({ nullable: true })
    dealId: string;

    @CreateDateColumn()
    createdAt: Date;
}
