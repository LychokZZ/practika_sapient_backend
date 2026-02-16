/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';


@Entity('leads')
export class Lead {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    clientName: string;

    @Column({ unique: true })
    phone: string;

    @Column({ unique: true })
    source: string;

    @Column({ unique: true })
    status: string;

    @Column({ unique: true })
    createdByUserId: string;

    @Column({ unique: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

}
