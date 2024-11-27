import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const AddBusiness = ({ onClose }) => {
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessLogo, setBusinessLogo] = useState(null);
  const [category, setCategory] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // For category modal
  const [isImageModalVisible, setIsImageModalVisible] = useState(false); // For image upload options modal
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // For success message

  const availableCategories = ['Food', 'Accessories', 'Clothes', 'Decor', 'Health', 'Book', 'Stationary', 'Handmade']; // Example categories

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

  const handleCategorySelect = (category) => {
    // Toggle category selection
    setCategory((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  const handleSubmit = async () => {
    if (!businessName || !businessDescription || !businessLogo || category.length === 0) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      const db = getFirestore(); // Initialize Firestore
      await addDoc(collection(db, 'businesses'), {
        businessName,
        businessDescription,
        businessLogo,
        category,
      });

      setIsSuccessModalVisible(true); // Show success modal
    } catch (e) {
      console.error('Error adding document: ', e);
      Alert.alert('Error', 'Failed to add business.');
    }
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

      <Text style={styles.label}>Categories</Text>
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => setIsModalVisible(true)} // Show modal for categories
      >
        <Text style={styles.categoryButtonText}>
          {category.length === 0 ? 'Select Categories' : category.join(', ')}
        </Text>
      </TouchableOpacity>

      {/* Upload Business Logo */}
      <Text style={styles.label}>Business Logo</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={() => setIsImageModalVisible(true)}>
        <Text style={styles.uploadText}>{businessLogo ? 'Logo Selected' : 'Upload Logo'}</Text>
      </TouchableOpacity>

      {businessLogo && <Text style={styles.fileName}>Logo: {businessLogo.split('/').pop()}</Text>}

      {/* Image Selection Modal */}
      <Modal
        visible={isImageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Image Option</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={pickImage}
            >
              <Text style={styles.modalButtonText}>Upload from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={takePhoto}
            >
              <Text style={styles.modalButtonText}>Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsImageModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Category Selection Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Categories</Text>
            <FlatList
              data={availableCategories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalButton, category.includes(item) && styles.selectedCategory]} // Apply selected style for multiple categories
                  onPress={() => handleCategorySelect(item)}
                >
                  <Text
                    style={[styles.modalButtonText, category.includes(item) && styles.selectedCategoryText]} // Change text color for selected categories
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={isSuccessModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalText}>Business has been added successfully.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setIsSuccessModalVisible(false);
                onClose(); // Close the form
              }}
            >
              <Text style={styles.modalButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.submitButton, { opacity: businessName && businessDescription && businessLogo && category.length > 0 ? 1 : 0.5 }]}
          onPress={handleSubmit}
          disabled={!businessName || !businessDescription || !businessLogo || category.length === 0}
        >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.submitButton, styles.cancelButton]} onPress={onClose}>
          <Text style={styles.submitText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E1FF',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#5A189A',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#5A189A',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  uploadText: {
    color: '#E6E1FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fileName: {
    marginTop: 10,
    color: '#555',
  },
  categoryButton: {
    backgroundColor: '#5A189A',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  categoryButtonText: {
    color: '#E6E1FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A189A',
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#5A189A',
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  selectedCategory: {
    backgroundColor: '#5A189A',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between the buttons
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#5A189A',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddBusiness;
