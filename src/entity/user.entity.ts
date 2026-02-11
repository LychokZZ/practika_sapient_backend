/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    fullName: string;

    @Column({ default: false })
    isActive: boolean;

    @Column({ unique: true })
    email: string;

    @Column()
    hashPassword: string;

    @Column({ nullable: true })
    hashRefreshToken: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: 'user' })
    role: 'user' | 'admin' | 'manager';
}
