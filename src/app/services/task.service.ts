import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Task } from '../constants/tasks.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks'; // Update with your API URL
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.http.get<Task[]>(this.apiUrl)
      .subscribe(tasks => this.tasksSubject.next(tasks));
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