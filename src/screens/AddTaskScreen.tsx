import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { TaskForm } from '../components/TaskForm';
import { RootStackParamList } from '../types';
import { createTask, updateTask } from '../services/taskService';

type AddTaskScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddTask'
>;
type AddTaskScreenRouteProp = RouteProp<RootStackParamList, 'AddTask'>;

interface Props {
  navigation: AddTaskScreenNavigationProp;
  route: AddTaskScreenRouteProp;
}

export const AddTaskScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = useAuth();
  const { taskToEdit } = route.params || {};
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (taskData: any) => {
    if (!user) return;

    setLoading(true);
    try {
      if (taskToEdit) {
        // Update existing task
        await updateTask(taskToEdit.id, taskData);
        Alert.alert('Success', 'Task updated successfully');
      } else {
        // Create new task
        await createTask(user.uid, taskData);
        Alert.alert('Success', 'Task created successfully');
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {taskToEdit ? 'Edit Task' : 'Add New Task'}
        </Text>
        <View style={styles.placeholderButton} />
      </View>

      <TaskForm
        onSubmit={handleSubmit}
        initialData={taskToEdit}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#3B82F6',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 12,
  },
  placeholderButton: {
    width: 40,
  },
});