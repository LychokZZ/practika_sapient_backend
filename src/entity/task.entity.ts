/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    dueDate: Date;

    @Column({ default: 'medium' })
    priority: string;

    @Column({ default: 'pending' })
    status: string;

    @Column({ nullable: true })
    leadId: string;

    @Column({ nullable: true })
    dealId: string;

    @Column()
    managerId: string;

    @CreateDateColumn()
    createdAt: Date;
}
