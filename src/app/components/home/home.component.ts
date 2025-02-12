import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <h1>Welcome to Task Manager</h1>
      <div class="button-container">
        <button class="primary-button" (click)="navigateToCreateTask()">Create New Task</button>
        <button class="secondary-button" (click)="navigateToTaskList()">View Task List</button>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      text-align: center;
      padding: 3rem;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 2rem;
    }
    .button-container {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      margin-top: 2rem;
    }
    .primary-button, .secondary-button {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      cursor: pointer;
      border-radius: 4px;
      border: none;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .primary-button {
      background-color: #007bff;
      color: white;
    }
    .secondary-button {
      background-color: #6c757d;
      color: white;
    }
    .primary-button:hover, .secondary-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToCreateTask() {
    this.router.navigate(['/create-task']);
  }

  navigateToTaskList() {
    this.router.navigate(['/tasks']);
  }
} 