import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getStyles = () => {
    switch (priority) {
      case 'high':
        return {
          containerStyle: styles.highBadge,
          textStyle: styles.highText,
        };
      case 'medium':
        return {
          containerStyle: styles.mediumBadge,
          textStyle: styles.mediumText,
        };
      case 'low':
        return {
          containerStyle: styles.lowBadge,
          textStyle: styles.lowText,
        };
    }
  };

  const { containerStyle, textStyle } = getStyles();

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{priority.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  highBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  highText: {
    color: '#991B1B',
    fontSize: 10,
    fontWeight: '700',
  },
  mediumBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  mediumText: {
    color: '#92400E',
    fontSize: 10,
    fontWeight: '700',
  },
  lowBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  lowText: {
    color: '#166534',
    fontSize: 10,
    fontWeight: '700',
  },
});