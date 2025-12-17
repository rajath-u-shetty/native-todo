import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { formatDate, isOverdue } from '../utils/helpers';

interface TaskCardProps {
  task: Task;
  onToggleComplete: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  const overdue = isOverdue(task.deadline) && !task.completed;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              task.completed && styles.titleCompleted,
            ]}
          >
            {task.title}
          </Text>
        </View>
        <PriorityBadge priority={task.priority} />
      </View>

      {task.description && (
        <Text
          style={styles.description}
          numberOfLines={2}
        >
          {task.description}
        </Text>
      )}

      <View style={styles.dateContainer}>
        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
        <Text
          style={[
            styles.dateText,
            overdue && styles.overdueText,
          ]}
        >
          Due: {formatDate(task.deadline)}
          {overdue && ' (Overdue)'}
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={onToggleComplete}
          style={styles.completeButton}
        >
          <Ionicons
            name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={task.completed ? '#10B981' : '#6B7280'}
          />
          <Text style={styles.completeText}>
            {task.completed ? 'Completed' : 'Mark Complete'}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
            <Ionicons name="create-outline" size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
    lineHeight: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 8,
  },
  overdueText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  completeText: {
    color: '#4B5563',
    marginLeft: 8,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
});