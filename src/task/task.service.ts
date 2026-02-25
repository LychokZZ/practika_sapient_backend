/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entity/task.entity';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) {}

    async create(taskData: any) {
        const task = this.taskRepository.create(taskData);
        await this.taskRepository.save(task);
        return { message: 'Task created successfully', task };
    }

    async findOne(id: string) {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async update(id: string, updateData: any) {
        const task = await this.findOne(id);
        Object.assign(task, updateData);
        await this.taskRepository.save(task);
        return { message: 'Task updated successfully', task };
    }

    async updateStatus(id: string, status: string) {
        const task = await this.findOne(id);
        task.status = status;
        await this.taskRepository.save(task);
        return { message: 'Task status updated successfully', task };
    }

    async remove(id: string) {
        const task = await this.findOne(id);
        await this.taskRepository.remove(task);
        return { message: 'Task deleted successfully' };
    }
}

