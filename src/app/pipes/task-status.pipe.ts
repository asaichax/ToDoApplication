import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe that transforms a task's completed status into a readable string
 */
@Pipe({
  name: 'taskStatus'
})
export class TaskStatusPipe implements PipeTransform {
  /**
   * Transform boolean completed status to string
   * @param completed Whether the task is completed
   * @returns 'Completed' or 'In Progress'
   */
  transform(completed: boolean): string {
    return completed ? 'Completed' : 'In Progress';
  }
} 