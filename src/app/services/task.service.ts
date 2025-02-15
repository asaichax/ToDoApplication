import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { tap, catchError, map, shareReplay } from 'rxjs/operators';
import { Task } from '../constants/tasks.interface';

/**
 * Service responsible for managing tasks in the application
 * Uses localStorage for persistence and BehaviorSubject for state management
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  /** Counter for generating unique task IDs */
  private nextId = 1;
  /** Main subject for storing and broadcasting tasks */
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  /** Subject for broadcasting error messages */
  private errorSubject = new Subject<string>();

  /** Observable of all tasks */
  tasks$ = this.tasksSubject.asObservable();
  /** Observable of error messages */
  errors$ = this.errorSubject.asObservable();
  
  /** Observable of completed tasks only */
  completedTasks$ = this.tasks$.pipe(
    map(tasks => tasks.filter(task => task.completed))
  );

  /** Observable of pending tasks only */
  pendingTasks$ = this.tasks$.pipe(
    map(tasks => tasks.filter(task => !task.completed))
  );

  /** Observable of task statistics */
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

  /** Get an observable of all tasks */
  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  /**
   * Add a new task to the collection
   * @param task The task to add
   * @returns Observable of the created task
   */
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
    
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    this.tasksSubject.next(updatedTasks);

    return of(newTask);
  }

  /**
   * Remove a task from the collection
   * @param taskId ID of the task to remove
   */
  removeTask(taskId: number): Observable<void> {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);
    
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    this.tasksSubject.next(updatedTasks);

    return of(void 0);
  }

  /**
   * Update an existing task
   * @param task The task with updated values
   * @returns Observable of the updated task
   */
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
      
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      this.tasksSubject.next(updatedTasks);
      
      return of(updatedTask);
    }
    
    return of(task);
  }

  /**
   * Toggle the completed status of a task
   * @param task The task to toggle
   */
  toggleTaskComplete(task: Task): Observable<Task> {
    return this.updateTask({
      ...task,
      completed: !task.completed
    });
  }

  /** Refresh tasks (no-op for localStorage implementation) */
  refresh(): void {
    // For localStorage implementation, we don't need to do anything
  }
} 