import { Injectable } from '@angular/core';
import { Task } from '../constants/tasks.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private nextId = 1;

  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(task: Task): void {
    const now = new Date();
    task.id = this.nextId++;
    task.name = task.title;
    task.createdAt = now;
    task.updatedAt = now;
    this.tasks.push(task);
  }

  removeTask(task: Task): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }

  toggleTaskComplete(task: Task): void {
    task.completed = !task.completed;
    task.updatedAt = new Date();
  }
} 