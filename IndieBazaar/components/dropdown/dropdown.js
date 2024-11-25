import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DropDown = ({ options, onSelect, placeholder = 'Select an option' }) => {
    const [visible, setVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setVisible(false);
        onSelect(option); // Notify the parent component of the selected option
    };

    return (
        <View style={styles.container}>
            {/* Dropdown Trigger */}
            <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setVisible(true)}>
                <Text style={styles.selectedText}>
                    {selectedOption || placeholder}
                </Text>
                <Ionicons name={visible ? 'chevron-up' : 'chevron-down'} size={20} color="#333" />
            </TouchableOpacity>

            {/* Dropdown Modal */}
            {visible && (
                <Modal
                    animationType="slide"
                    transparent
                    visible={visible}
                    onRequestClose={() => setVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        onPress={() => setVisible(false)}
                    />
                    <View style={styles.dropdownContainer}>
                        <FlatList
                            data={options}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropdownOption}
                                    onPress={() => handleOptionSelect(item)}
                                >
                                    <Text style={styles.optionText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        width: '100%',
    },
    dropdownTrigger: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    selectedText: {
        fontSize: 16,
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dropdownContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        maxHeight: '40%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 10,
    },
    dropdownOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
});

export default DropDown;
