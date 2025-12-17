export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dateTime: Date;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  email: string | null;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  AddTask: { taskToEdit?: Task };
};