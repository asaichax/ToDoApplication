import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from '../../constants/tasks.interface';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tasks-form',
  template: `
    <div class="form-container">
      <h2>Create New Task</h2>
      <div *ngIf="showSuccess" class="success-message">
        Task created successfully!
      </div>
      <form (ngSubmit)="onSubmit()" #taskForm="ngForm">
        <div class="form-group">
          <label for="title">Task Title:</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            [(ngModel)]="task.title" 
            required
            class="form-control">
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea 
            id="description" 
            name="description" 
            [(ngModel)]="task.description"
            class="form-control">
          </textarea>
        </div>
        <button type="submit" [disabled]="!taskForm.form.valid || isSubmitting">
          {{ isSubmitting ? 'Creating...' : 'Create Task' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    textarea.form-control {
      min-height: 100px;
    }
    button {
      background-color: #007bff;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    button:hover {
      background-color: #0056b3;
    }
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .success-message {
      background-color: #d4edda;
      color: #155724;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
  `]
})
export class TasksFormComponent {
  task: Task = {
    id: 0,
    name: '',
    title: '',
    description: '',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  showSuccess = false;
  isSubmitting = false;

  constructor(
    private taskService: TaskService
  ) {}

  onSubmit() {
    if (this.isSubmitting || !this.task.title) return;
    
    this.isSubmitting = true;
    this.task.name = this.task.title; // Sync name with title

    this.taskService.addTask(this.task).subscribe({
      next: () => {
        this.showSuccess = true;
        this.isSubmitting = false;
        this.resetForm();
        setTimeout(() => this.showSuccess = false, 3000);
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.isSubmitting = false;
        // Handle error (show error message to user)
      }
    });
  }

  private resetForm() {
    this.task = {
      id: 0,
      name: '',
      title: '',
      description: '',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

