import { Component, Input, type OnInit } from "@angular/core"
import type { Task } from "../../constants/tasks.interface"
import { TaskService } from '../../services/task.service'

@Component({
  selector: "app-tasks-list",
  templateUrl: "./tasks-list.component.html",
})
export class TasksListComponent implements OnInit {
  // Input decorator marks tasks property as input from parent component
  @Input() tasks: Task[]

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks()
  }

  /**
   * Removes a task from the tasks array
   * @param task The task to be removed
   */
  removeTask(task: Task) {
    this.taskService.removeTask(task)
  }

  /**
   * Toggles the completed status of a task
   * @param task The task to toggle
   */
  toggleCompleted(task: Task) {
    // Flip the completed boolean value
    task.completed = !task.completed
  }
}

