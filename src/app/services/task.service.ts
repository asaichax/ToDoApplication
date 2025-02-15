import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { tap, catchError, map, shareReplay } from 'rxjs/operators';
import { Task } from '../constants/tasks.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks'; // Update with your API URL
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private refreshTrigger = new Subject<void>();
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

  constructor(private http: HttpClient) {
    // Initialize data load
    this.refreshTrigger.pipe(
      tap(() => this.loadTasks())
    ).subscribe();
    
    // Initial load
    this.refresh();
  }

  refresh(): void {
    this.refreshTrigger.next();
  }

  private loadTasks(): void {
    this.http.get<Task[]>(this.apiUrl).pipe(
      catchError(error => {
        this.errorSubject.next('Failed to load tasks');
        throw error;
      })
    ).subscribe(tasks => this.tasksSubject.next(tasks));
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(task: Task): Observable<Task> {
    const now = new Date();
    const newTask = {
      ...task,
      createdAt: now,
      updatedAt: now
    };

    return this.http.post<Task>(this.apiUrl, newTask).pipe(
      tap(createdTask => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next([...currentTasks, createdTask]);
      })
    );
  }

  removeTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next(currentTasks.filter(task => task.id !== taskId));
      })
    );
  }

  updateTask(task: Task): Observable<Task> {
    const updatedTask = {
      ...task,
      updatedAt: new Date()
    };

    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, updatedTask).pipe(
      tap(updated => {
        const currentTasks = this.tasksSubject.value;
        const index = currentTasks.findIndex(t => t.id === updated.id);
        if (index !== -1) {
          currentTasks[index] = updated;
          this.tasksSubject.next([...currentTasks]);
        }
      })
    );
  }

  toggleTaskComplete(task: Task): Observable<Task> {
    return this.updateTask({
      ...task,
      completed: !task.completed
    });
  }
} 