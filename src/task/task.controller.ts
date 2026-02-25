/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('manager/tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Roles('manager', 'admin')
  @Post()
  createTask(@Body() taskData: any, @Request() req) {
    taskData.managerId = req.user.userId;
    return this.taskService.create(taskData);
  }

  @Roles('manager', 'admin')
  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() updateData: any) {
    return this.taskService.update(id, updateData);
  }

  @Roles('manager', 'admin')
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.remove(id);
  }

  @Roles('manager', 'admin')
  @Patch(':id/status')
  updateTaskStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.taskService.updateStatus(id, status);
  }
}
