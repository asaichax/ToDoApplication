import { Component, OnInit, OnDestroy } from "@angular/core"
import type { Task } from "../../constants/tasks.interface"
import { TaskService } from '../../services/task.service'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: "app-tasks-list",
  templateUrl: "./tasks-list.component.html",
})
export class TasksListComponent implements OnInit, OnDestroy {
  tasks$: Observable<Task[]>
  completedTasks$: Observable<Task[]>
  pendingTasks$: Observable<Task[]>
  taskStats$: Observable<{ total: number; completed: number; pending: number }>
  errors$: Observable<string>
  
  private destroy$ = new Subject<void>()

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.tasks$
    this.completedTasks$ = this.taskService.completedTasks$
    this.pendingTasks$ = this.taskService.pendingTasks$
    this.taskStats$ = this.taskService.taskStats$
    this.errors$ = this.taskService.errors$
  }

  ngOnInit(): void {
    // Refresh tasks when component initializes
    this.taskService.refresh()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  /**
   * Removes a task from the tasks array
   * @param task The task to be removed
   */
  removeTask(task: Task) {
    this.taskService.removeTask(task.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      error: (error) => console.error('Error removing task:', error)
    })
  }

  /**
   * Toggles the completed status of a task
   * @param task The task to toggle
   */
  toggleCompleted(task: Task) {
    this.taskService.toggleTaskComplete(task).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      error: (error) => console.error('Error toggling task:', error)
    })
  }
}

