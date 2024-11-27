import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AddBusinessButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Add Business</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#E6E1FF',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  text: {
    color: '#5A189A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddBusinessButton;
