import { Task } from '../types';

export type SortType = 'priority' | 'deadline';

// Priority weights for sorting
const PRIORITY_WEIGHTS = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Sort tasks by the specified type
 */
export const sortTasks = (tasks: Task[], sortType: SortType): Task[] => {
  const tasksCopy = [...tasks];
  
  switch (sortType) {
    case 'priority':
      // Sort by priority: High → Medium → Low
      return tasksCopy.sort((a, b) => {
        return PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
      });
      
    case 'deadline':
      // Sort by deadline: Earliest first
      return tasksCopy.sort((a, b) => {
        return a.deadline.getTime() - b.deadline.getTime();
      });
      
    default:
      return tasksCopy;
  }
};

/**
 * Filter tasks by completion status
 */
export const filterTasks = (
  tasks: Task[],
  filter: 'all' | 'active' | 'completed'
): Task[] => {
  switch (filter) {
    case 'active':
      return tasks.filter(task => !task.completed);
    case 'completed':
      return tasks.filter(task => task.completed);
    default:
      return tasks;
  }
};