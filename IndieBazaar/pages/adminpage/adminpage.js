import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AddBusinessButton from '../../components/addbusinessbutton/addbusinessbutton';
import AddBusiness from '../../components/addbusiness/addbusiness';

const AdminPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <View style={styles.container}>
      {showForm ? (
        <AddBusiness onClose={() => setShowForm(false)} />
      ) : (
        <AddBusinessButton onPress={() => setShowForm(true)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
});

export default AdminPage;
