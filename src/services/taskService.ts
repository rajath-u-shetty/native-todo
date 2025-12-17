import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import { Task } from '../types';

const TASKS_COLLECTION = 'tasks';

/**
 * Create a new task in Firestore
 */
export const createTask = async (
  userId: string,
  taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) => {
  try {
    console.log('Creating task for user:', userId);
    console.log('Task data:', taskData);

    const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
      ...taskData,
      userId,
      dateTime: Timestamp.fromDate(new Date(taskData.dateTime)),
      deadline: Timestamp.fromDate(new Date(taskData.deadline)),
      completed: taskData.completed || false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log('Task created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (
  taskId: string,
  updates: Partial<Task>
) => {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    // Convert Date objects to Timestamps
    if (updates.dateTime instanceof Date) {
      updateData.dateTime = Timestamp.fromDate(updates.dateTime);
    }
    if (updates.deadline instanceof Date) {
      updateData.deadline = Timestamp.fromDate(updates.deadline);
    }

    console.log('Updating task:', taskId);
    await updateDoc(taskRef, updateData);
    console.log('Task updated successfully');
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (taskId: string) => {
  try {
    console.log('Deleting task:', taskId);
    await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
    console.log('Task deleted successfully');
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time task updates for a specific user
 * Returns an unsubscribe function
 */
export const subscribeToTasks = (
  userId: string,
  callback: (tasks: Task[]) => void
) => {
  try {
    console.log('Subscribing to tasks for user:', userId);

    // First, try simple query without orderBy
    let q;
    try {
      // Try with orderBy
      q = query(
        collection(db, TASKS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    } catch (err) {
      console.warn('OrderBy failed, trying without it:', err);
      // Fallback to query without orderBy
      q = query(
        collection(db, TASKS_COLLECTION),
        where('userId', '==', userId)
      );
    }

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('✅ Snapshot received. Docs count:', snapshot.docs.length);

        const tasks: Task[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log('Processing task:', doc.id, data);
          
          return {
            id: doc.id,
            title: data.title || '',
            description: data.description || '',
            dateTime: data.dateTime?.toDate ? data.dateTime.toDate() : new Date(),
            deadline: data.deadline?.toDate ? data.deadline.toDate() : new Date(),
            priority: data.priority || 'medium',
            completed: data.completed || false,
            userId: data.userId || '',
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
          } as Task;
        });

        console.log('✅ Tasks fetched:', tasks.length);
        callback(tasks);
      },
      (error) => {
        console.error('❌ Error in task subscription:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        // Call callback with empty array on error
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('❌ Error setting up task subscription:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

/**
 * Toggle task completion status
 */
export const toggleTaskCompletion = async (
  taskId: string,
  completed: boolean
) => {
  try {
    console.log('Toggling task completion:', taskId, 'to', completed);
    await updateTask(taskId, { completed });
  } catch (error) {
    console.error('Error toggling task completion:', error);
    throw error;
  }
};