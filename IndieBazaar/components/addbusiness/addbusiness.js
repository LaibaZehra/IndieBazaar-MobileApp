import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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

  const uploadImageToStorage = async (uri) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        
        const storage = getStorage(); // Initialize Firebase Storage
        const fileName = `businessLogos/${Date.now()}.jpg`; // Unique file name
        const storageRef = ref(storage, fileName); // Create reference

        await uploadBytes(storageRef, blob); // Upload the file
        const downloadURL = await getDownloadURL(storageRef); // Get the download URL

        return downloadURL;
    } catch (error) {
        console.error('Error uploading image to Firebase Storage:', error);
        throw error;
    }
};

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
  });
  if (!result.canceled) {
      const downloadURL = await uploadImageToStorage(result.assets[0].uri); // Upload and get URL
      setBusinessLogo(downloadURL); // Save Firebase URL
  }
};

const takePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
  });
  if (!result.canceled) {
      const downloadURL = await uploadImageToStorage(result.assets[0].uri); // Upload and get URL
      setBusinessLogo(downloadURL); // Save Firebase URL
  }
};

  const handleCategorySelect = (category) => {
    // Toggle category selection
    setCategory((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  const handleSubmit = async () => {
  if (!businessName.trim() || !businessDescription.trim() || !businessLogo || category.length === 0) {
    Alert.alert('Error', 'All fields are required.');
    return;
  }

  try {
    const db = getFirestore(); // Initialize Firestore
    await addDoc(collection(db, 'businesses'), {
      name: businessName.trim(), // Align field names with expected format
      description: businessDescription.trim(),
      logo: businessLogo, // Ensure this is the correct string format (URI or Firebase URL)
      category, // Array of strings
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
            <View style={styles.catList}>
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
              <Text style={styles.modalButtonText}>Capture with Camera</Text>
            </TouchableOpacity>
            </View>
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
            <View style={styles.catList}>
              {availableCategories.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalButton,
                    category.includes(item) ? styles.selectedCategory : styles.unselectedCategory, // Apply styles based on selection
                  ]}
                  onPress={() => handleCategorySelect(item)}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      category.includes(item) ? styles.selectedCategoryText : styles.unselectedCategoryText, // Change text color based on selection
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

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
    width: '80%',
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
  selectedCategoryText: {
    color: '#E6E1FF',
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
    textAlign: 'center',
  },
  modalButton: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#5A189A',
    alignItems: 'center',
    width: '45%',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 20,
  },
  catList: {
    flexDirection: 'row', // Categories will be in a row
    flexWrap: 'wrap', // Wrap to the next line if needed
    justifyContent: 'center', // Space between categories
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
    textAlign: 'center',
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
    justifyContent: 'center', // Space between the buttons
    marginTop: 20,
    gap: 10,
    marginBottom: 40,
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
  selectedCategory: {
    backgroundColor: '#E6E1FF', // Light gray for unselected categories
  },
  selectedCategoryText: {
    color: '#5A189A', // Darker text for unselected categories
  },
  unselectedCategory: {
    backgroundColor: '#5A189A', // Purple for selected categories
  },
  unselectedCategoryText: {
    color: '#E6E1FF', // White text for selected categories
  },
  
});

export default AddBusiness;
