import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <div class="nav-brand" (click)="navigateHome()">Task Manager</div>
      <div class="nav-links">
        <button class="nav-button" (click)="navigateHome()">Home</button>
        <button class="nav-button" (click)="navigateToTasks()">Tasks</button>
        <button class="nav-button" (click)="navigateToCreateTask()">New Task</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #2c3e50;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .nav-brand {
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
      cursor: pointer;
    }
    .nav-links {
      display: flex;
      gap: 1rem;
    }
    .nav-button {
      background-color: transparent;
      color: white;
      border: 1px solid white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .nav-button:hover {
      background-color: white;
      color: #2c3e50;
    }
  `]
})
export class NavbarComponent {
  constructor(private router: Router) {}

  navigateHome() {
    this.router.navigate(['/']);
  }

  navigateToTasks() {
    this.router.navigate(['/tasks']);
  }

  navigateToCreateTask() {
    this.router.navigate(['/create-task']);
  }
}
