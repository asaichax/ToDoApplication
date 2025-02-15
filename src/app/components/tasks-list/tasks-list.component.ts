import { Component, OnInit } from "@angular/core"
import type { Task } from "../../constants/tasks.interface"
import { TaskService } from '../../services/task.service'
import { Observable } from 'rxjs'

@Component({
  selector: "app-tasks-list",
  templateUrl: "./tasks-list.component.html",
})
export class TasksListComponent implements OnInit {
  tasks$: Observable<Task[]>

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.getTasks()
  }

  ngOnInit(): void {}

  /**
   * Removes a task from the tasks array
   * @param task The task to be removed
   */
  removeTask(task: Task) {
    this.taskService.removeTask(task.id).subscribe()
  }

  /**
   * Toggles the completed status of a task
   * @param task The task to toggle
   */
  toggleCompleted(task: Task) {
    this.taskService.toggleTaskComplete(task).subscribe()
  }
}

