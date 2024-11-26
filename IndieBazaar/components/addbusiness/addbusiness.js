import React, { useState } from 'react';
import { View, TextInput, Text, Button, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';  // Firebase Firestore imports

const AddBusiness = ({ onClose }) => {
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessLogo, setBusinessLogo] = useState(null);
  const [category, setCategory] = useState('');  // State for category

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setBusinessLogo(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setBusinessLogo(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    // Save business info to Firestore
    try {
      const db = getFirestore();  // Initialize Firestore
      await addDoc(collection(db, 'businesses'), {
        businessName,
        businessDescription,
        businessLogo,
        category,
      });

      console.log('Business added successfully!');
      onClose(); // Close the form after submission
    } catch (e) {
      console.error('Error adding document: ', e);
      Alert.alert('Error', 'Failed to add business.');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert('Upload Logo', 'Choose an option:', [
      { text: 'Pick from Gallery', onPress: pickImage },
      { text: 'Take a Photo', onPress: takePhoto },
      { text: 'Cancel', style: 'cancel', onPress: () => {} },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Business Name</Text>
      <TextInput
        style={styles.input}
        value={businessName}
        onChangeText={setBusinessName}
        placeholder="Enter business name"
      />

      <Text style={styles.label}>Business Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={businessDescription}
        onChangeText={setBusinessDescription}
        placeholder="Enter business description"
        multiline
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="Enter business category"
      />

      <Text style={styles.label}>Business Logo</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={showImagePickerOptions}>
        <Text style={styles.uploadText}>{businessLogo ? 'Logo Selected' : 'Upload Logo'}</Text>
      </TouchableOpacity>

      {businessLogo && <Text style={styles.fileName}>Logo: {businessLogo.split('/').pop()}</Text>}

      <Button title="Submit" onPress={handleSubmit} />
      <Button title="Cancel" color="red" onPress={onClose} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  uploadButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  uploadText: {
    color: '#fff',
    textAlign: 'center',
  },
  fileName: {
    marginTop: 10,
    color: '#555',
  },
});

export default AddBusiness;
