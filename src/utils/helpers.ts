import { format, isPast, differenceInHours } from 'date-fns';

export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'MMM dd, yyyy hh:mm a');
};

export const isOverdue = (deadline: Date): boolean => {
  return isPast(deadline);
};

export const getUrgencyColor = (deadline: Date): string => {
  const hoursUntilDeadline = differenceInHours(deadline, new Date());
  
  if (hoursUntilDeadline < 0) return 'red'; // Overdue
  if (hoursUntilDeadline < 24) return 'orange'; // Less than 1 day
  if (hoursUntilDeadline < 72) return 'yellow'; // Less than 3 days
  return 'green'; // More than 3 days
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return '#EF4444'; // red-500
    case 'medium':
      return '#F59E0B'; // amber-500
    case 'low':
      return '#10B981'; // green-500
    default:
      return '#6B7280'; // gray-500
  }
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};