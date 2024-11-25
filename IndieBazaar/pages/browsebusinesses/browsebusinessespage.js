import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { db } from '../../firebase/firebase'; // Firebase setup
import DropDown from '../../components/dropdown/dropdown'; // Dropdown component
import { collection, query, where, getDocs } from 'firebase/firestore'; // Firestore functions
import { useNavigation } from '@react-navigation/native';

const BrowseBusinesses = () => {
    const navigation = useNavigation();
    const [businesses, setBusinesses] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    const allCategories = ['Food', 'Accessories', 'Clothes', 'Decor', 'Health', 'Book', 'Stationary', 'Handmade'];

    // Fetch businesses from Firebase
    const fetchBusinesses = async () => {
        try {
            let q;
            if (selectedCategories.length > 0) {
                q = query(
                    collection(db, 'businesses'),
                    where('category', 'array-contains-any', selectedCategories)
                );
            } else {
                q = collection(db, 'businesses');
            }
    
            const querySnapshot = await getDocs(q);
            const fetchedBusinesses = querySnapshot.docs.map(doc => {
                console.log(doc.id, doc.data());  // Log the document ID and its data
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });
    
            console.log("Fetched businesses:", fetchedBusinesses); // Log the fetched businesses array
            setBusinesses(fetchedBusinesses);
        } catch (error) {
            console.error('Error fetching businesses: ', error);
        }
    };
    

    // Fetch businesses when `selectedCategories` changes
    useEffect(() => {
        fetchBusinesses();
    }, [selectedCategories]);

    // Filtered businesses based on the selected business name
    const filteredBusinesses = useMemo(() => {
        if (selectedBusiness) {
            return businesses.filter(business => business.name === selectedBusiness);
        }
        return businesses;
    }, [selectedBusiness, businesses]);

    const handleBusinessClick = (business) => {
        console.log("yay")
        navigation.navigate('BusinessHome', { businessId: business.id });
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Browse Businesses</Text>

            {/* Business Name Dropdown */}
            <DropDown
                options={businesses.map(business => business.name)} // Options populated dynamically
                onSelect={setSelectedBusiness}
                placeholder="Select a business"
            />

            {/* Category Filters */}
            <View style={styles.filterBoxContainer}>
                {allCategories.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.filterButton,
                            selectedCategories.includes(category) && styles.filterButtonSelected,
                        ]}
                        onPress={() => {
                            const isSelected = selectedCategories.includes(category);
                            setSelectedCategories(isSelected
                                ? selectedCategories.filter(c => c !== category)
                                : [...selectedCategories, category]);
                        }}
                    >
                        <Text
                            style={[
                                styles.filterButtonText,
                                selectedCategories.includes(category) && styles.filterButtonTextSelected,
                            ]}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Display Businesses */}
            <View style={styles.businessesContainer}>
                {filteredBusinesses.length > 0 ? (
                    <FlatList
                    data={filteredBusinesses}
                    keyExtractor={item => item.id} // This uses item.id
                    numColumns={2}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.businessCard}
                            onPress={() => handleBusinessClick(item)} // Passing the whole item
                        >
                            <Image source={{ uri: item.logo }} style={styles.businessImage} />
                            <Text style={styles.businessName}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
                ) : (
                    <Text>No businesses found in this category.</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    filterBoxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    filterButton: {
        backgroundColor: '#E0E0E0',
        padding: 10,
        margin: 5,
        borderRadius: 5,
    },
    filterButtonSelected: {
        backgroundColor: '#6200EE',
    },
    filterButtonText: {
        color: '#333',
        fontWeight: 'bold',
    },
    filterButtonTextSelected: {
        color: '#FFF',
    },
    businessesContainer: {
        flex: 1,
    },
    businessCard: {
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        width: 160,
        height: 220,
        marginBottom: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
        elevation: 5,
    },
    businessImage: {
        width: '100%',
        height: 140,
        borderRadius: 10,
        marginBottom: 10,
        resizeMode: 'cover',
    },
    businessName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default BrowseBusinesses;
