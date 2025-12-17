import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { Input } from './Input';
import { Button } from './Button';
import { Task } from '../types';
import { formatDateTime, formatDate } from '../utils/helpers';
import { Ionicons } from '@expo/vector-icons';

interface TaskFormProps {
  onSubmit: (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Task;
  loading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dateTime, setDateTime] = useState(initialData?.dateTime || new Date());
  const [deadline, setDeadline] = useState(
    initialData?.deadline || new Date(Date.now() + 24 * 60 * 60 * 1000)
  );
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    initialData?.priority || 'medium'
  );

  // Date picker modal states
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [activePickerType, setActivePickerType] = useState<'dateTime' | 'deadline' | null>(null);
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (deadline < new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateTimeChange = (newDate: Date) => {
    if (activePickerType === 'dateTime') {
      setDateTime(newDate);
    } else if (activePickerType === 'deadline') {
      setDeadline(newDate);
    }
  };

  const closeDateModal = () => {
    setShowDateTimeModal(false);
    setShowDeadlineModal(false);
    setActivePickerType(null);
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dateTime,
      deadline,
      priority,
      completed: initialData?.completed || false,
    });
  };

  const getPriorityButtonStyle = (p: 'low' | 'medium' | 'high') => {
    if (priority !== p) {
      return styles.priorityButtonDefault;
    }
    switch (p) {
      case 'high':
        return styles.priorityButtonHigh;
      case 'medium':
        return styles.priorityButtonMedium;
      case 'low':
        return styles.priorityButtonLow;
    }
  };

  const getPriorityTextStyle = (p: 'low' | 'medium' | 'high') => {
    if (priority !== p) {
      return styles.priorityTextDefault;
    }
    return styles.priorityTextActive;
  };

  // Generate time slots (every 30 minutes)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date();
        time.setHours(hour, minute, 0);
        slots.push(time);
      }
    }
    return slots;
  };

  // Generate date range (next 30 days)
  const generateDateRange = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const timeSlots = generateTimeSlots();
  const dateRange = generateDateRange();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Input
        label="Title *"
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
        error={errors.title}
      />

      <View style={styles.descriptionContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter task description"
          multiline
          numberOfLines={4}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.priorityContainer}>
        <Text style={styles.priorityLabel}>Priority</Text>
        <View style={styles.priorityButtonsRow}>
          {(['low', 'medium', 'high'] as const).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPriority(p)}
              style={[styles.priorityButton, getPriorityButtonStyle(p)]}
            >
              <Text style={[styles.priorityText, getPriorityTextStyle(p)]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Start Date & Time */}
      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateTimeLabel}>Start Date & Time</Text>
        <TouchableOpacity
          onPress={() => {
            setActivePickerType('dateTime');
            setShowDateTimeModal(true);
          }}
          style={styles.dateTimeButton}
        >
          <Ionicons name="calendar" size={18} color="#3B82F6" style={styles.dateIcon} />
          <Text style={styles.dateTimeText}>{formatDateTime(dateTime)}</Text>
        </TouchableOpacity>
      </View>

      {/* Deadline */}
      <View style={styles.dateTimeContainer}>
        <Text style={[styles.dateTimeLabel, errors.deadline && styles.errorLabel]}>
          Deadline *
        </Text>
        <TouchableOpacity
          onPress={() => {
            setActivePickerType('deadline');
            setShowDateTimeModal(true);
          }}
          style={[
            styles.dateTimeButton,
            errors.deadline && styles.dateTimeButtonError,
          ]}
        >
          <Ionicons name="calendar" size={18} color="#3B82F6" style={styles.dateIcon} />
          <Text style={styles.dateTimeText}>{formatDateTime(deadline)}</Text>
        </TouchableOpacity>
        {errors.deadline && (
          <Text style={styles.errorText}>{errors.deadline}</Text>
        )}
      </View>

      <View style={styles.submitButtonContainer}>
        <Button
          title={initialData ? 'Update Task' : 'Create Task'}
          onPress={handleSubmit}
          loading={loading}
        />
      </View>

      {/* Date & Time Picker Modal */}
      <Modal
        visible={showDateTimeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeDateModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {activePickerType === 'dateTime' ? 'Start' : 'Deadline'} Date & Time
              </Text>
              <TouchableOpacity onPress={closeDateModal}>
                <Ionicons name="close" size={28} color="#1F2937" />
              </TouchableOpacity>
            </View>

            {/* Date Selection */}
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Date</Text>
              <FlatList
                data={dateRange}
                horizontal
                keyExtractor={(item) => item.toISOString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateListContent}
                renderItem={({ item }) => {
                  const currentDate = activePickerType === 'dateTime' ? dateTime : deadline;
                  const isSelected =
                    item.toDateString() === currentDate.toDateString();
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        const newDate = new Date(item);
                        newDate.setHours(
                          currentDate.getHours(),
                          currentDate.getMinutes()
                        );
                        handleDateTimeChange(newDate);
                      }}
                      style={[
                        styles.dateButton,
                        isSelected && styles.dateButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dateButtonText,
                          isSelected && styles.dateButtonTextSelected,
                        ]}
                      >
                        {item.getDate()}
                      </Text>
                      <Text
                        style={[
                          styles.dateButtonMonth,
                          isSelected && styles.dateButtonMonthSelected,
                        ]}
                      >
                        {item.toLocaleString('default', { month: 'short' })}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            {/* Time Selection */}
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Time</Text>
              <FlatList
                data={timeSlots}
                horizontal
                keyExtractor={(item) => item.toISOString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.timeListContent}
                renderItem={({ item }) => {
                  const currentDate = activePickerType === 'dateTime' ? dateTime : deadline;
                  const isSelected =
                    item.getHours() === currentDate.getHours() &&
                    item.getMinutes() === currentDate.getMinutes();
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        const newDate = new Date(currentDate);
                        newDate.setHours(item.getHours(), item.getMinutes());
                        handleDateTimeChange(newDate);
                      }}
                      style={[
                        styles.timeButton,
                        isSelected && styles.timeButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.timeButtonText,
                          isSelected && styles.timeButtonTextSelected,
                        ]}
                      >
                        {item.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            {/* Done Button */}
            <View style={styles.modalFooter}>
              <Button
                title="Done"
                onPress={closeDateModal}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  priorityContainer: {
    marginBottom: 20,
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  priorityButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  priorityButtonDefault: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
  },
  priorityButtonHigh: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  priorityButtonMedium: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FBBF24',
  },
  priorityButtonLow: {
    backgroundColor: '#DCFCE7',
    borderColor: '#10B981',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priorityTextDefault: {
    color: '#6B7280',
  },
  priorityTextActive: {
    color: '#111827',
  },
  dateTimeContainer: {
    marginBottom: 20,
  },
  dateTimeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  errorLabel: {
    color: '#EF4444',
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeButtonError: {
    borderColor: '#EF4444',
  },
  dateIcon: {
    marginRight: 8,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#1F2937',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  submitButtonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  pickerSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  dateListContent: {
    gap: 8,
    paddingRight: 16,
  },
  dateButton: {
    width: 70,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  dateButtonSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  dateButtonTextSelected: {
    color: '#FFFFFF',
  },
  dateButtonMonth: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  dateButtonMonthSelected: {
    color: '#FFFFFF',
  },
  timeListContent: {
    gap: 8,
    paddingRight: 16,
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  timeButtonSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  timeButtonTextSelected: {
    color: '#FFFFFF',
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});