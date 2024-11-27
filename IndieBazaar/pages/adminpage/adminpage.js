import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AddBusiness from '../../components/addbusiness/addbusiness';  // Import AddBusiness component
import AddBusinessButton from '../../components/addbusinessbutton/addbusinessbutton';  // Import AddBusinessButton component

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAddBusiness, setShowAddBusiness] = useState(false);  // Track when to show AddBusiness

  const adminCredentials = {
    username: 'admin',
    password: 'admin123',
  };

  const handleLogin = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (
      trimmedUsername === adminCredentials.username &&
      trimmedPassword === adminCredentials.password
    ) {
      setIsLoggedIn(true);
      setShowForm(true);
      setUsername('');
      setPassword('');
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowForm(false);
    setShowAddBusiness(false);  // Reset AddBusiness state when logging out
  };

  return (
    <View style={styles.container}>
      {!isLoggedIn ? (
        <>
        <View style={styles.admin}>
          <Text style={styles.title}>Admin Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {!showAddBusiness && (
            <View style={styles.loggedInContainer}>
              <Text style={styles.welcomeText}>Welcome, Admin!</Text>
              <View style={styles.buttonRow}>
                <AddBusinessButton onPress={() => setShowAddBusiness(true)} />
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {showAddBusiness && (
            <AddBusiness onClose={() => setShowAddBusiness(false)} />  // Add AddBusiness component with close functionality
          )}
        </>
      )}

      <Modal
        transparent={true}
        animationType="fade"
        visible={showAlert}
        onRequestClose={() => setShowAlert(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertContainer}>
            <Text style={styles.alertMessage}>Invalid Credentials. Please try again.</Text>
            <TouchableOpacity style={styles.okButton} onPress={() => setShowAlert(false)}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B2E3D8',
    paddingVertical: 30,
  },
  admin: {
    flex: 1,
    width: '100%',
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#5A189A',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  loginButton: {
    backgroundColor: '#5A189A',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '50%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loggedInContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5A189A',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // Space between the buttons
    marginTop: 20,
    gap: 20,  // Added gap between the buttons
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertMessage: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  okButton: {
    backgroundColor: '#5A189A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
});

export default AdminPage;
