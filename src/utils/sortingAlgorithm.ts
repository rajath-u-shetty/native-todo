import { Task } from '../types';

export type SortType = 'priority' | 'deadline';

const PRIORITY_WEIGHTS = {
  high: 3,
  medium: 2,
  low: 1,
};

export const sortTasks = (tasks: Task[], sortType: SortType): Task[] => {
  const tasksCopy = [...tasks];
  
  switch (sortType) {
    case 'priority':
      return tasksCopy.sort((a, b) => {
        return PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
      });
      
    case 'deadline':
      return tasksCopy.sort((a, b) => {
        return a.deadline.getTime() - b.deadline.getTime();
      });
      
    default:
      return tasksCopy;
  }
};

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