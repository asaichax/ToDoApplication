/**
 * Interface defining the structure of a Task object
 */
export interface Task {
  /** Unique identifier for the task */
  id: number;
  /** Task name (legacy field) */
  name: string;
  /** Task title */
  title: string;
  /** Task description */
  description: string;
  /** Whether the task is completed */
  completed: boolean;
  /** When the task was created */
  createdAt: Date;
  /** When the task was last updated */
  updatedAt: Date;
}

