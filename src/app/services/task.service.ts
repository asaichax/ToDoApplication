import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError, map, shareReplay } from 'rxjs/operators';
import { Task } from '../constants/tasks.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private nextId = 1;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private errorSubject = new Subject<string>();

  tasks$ = this.tasksSubject.asObservable();
  errors$ = this.errorSubject.asObservable();
  
  // Derived observables
  completedTasks$ = this.tasks$.pipe(
    map(tasks => tasks.filter(task => task.completed))
  );

  pendingTasks$ = this.tasks$.pipe(
    map(tasks => tasks.filter(task => !task.completed))
  );

  taskStats$ = this.tasks$.pipe(
    map(tasks => ({
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length
    })),
    shareReplay(1)
  );

  constructor() {
    // Load tasks from localStorage on initialization
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      this.tasksSubject.next(tasks);
      this.nextId = Math.max(...tasks.map((t: Task) => t.id), 0) + 1;
    }
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(task: Task): Observable<Task> {
    const now = new Date();
    const newTask = {
      ...task,
      id: this.nextId++,
      createdAt: now,
      updatedAt: now
    };

    const currentTasks = this.tasksSubject.value;
    const updatedTasks = [...currentTasks, newTask];
    
    // Save to localStorage
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    this.tasksSubject.next(updatedTasks);

    return of(newTask);
  }

  removeTask(taskId: number): Observable<void> {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);
    
    // Save to localStorage
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    this.tasksSubject.next(updatedTasks);

    return of(void 0);
  }

  updateTask(task: Task): Observable<Task> {
    const currentTasks = this.tasksSubject.value;
    const index = currentTasks.findIndex(t => t.id === task.id);
    
    if (index !== -1) {
      const updatedTask = {
        ...task,
        updatedAt: new Date()
      };
      const updatedTasks = [...currentTasks];
      updatedTasks[index] = updatedTask;
      
      // Save to localStorage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      this.tasksSubject.next(updatedTasks);
      
      return of(updatedTask);
    }
    
    return of(task);
  }

  toggleTaskComplete(task: Task): Observable<Task> {
    return this.updateTask({
      ...task,
      completed: !task.completed
    });
  }

  refresh(): void {
    // For localStorage implementation, we don't need to do anything here
    // as data is already in memory
  }
} 