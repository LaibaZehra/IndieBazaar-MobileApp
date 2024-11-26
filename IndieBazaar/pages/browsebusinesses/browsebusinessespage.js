import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image,  ScrollView  } from 'react-native';
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
            <FlatList
                data={filteredBusinesses}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.businessesContainer} // Use this for custom styles
                ListEmptyComponent={<Text style={styles.businessName}>No businesses found in this category.</Text>} // For empty lists
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.businessCard}
                        onPress={() => handleBusinessClick(item)}
                    >
                        <Image source={{ uri: item.logo }} style={styles.businessImage} />
                        <Text style={styles.businessName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#B2E3D8',
    },
    filterBoxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        padding: 10,
    },
    filterButton: {
        backgroundColor: '#E6E1FF',
        padding: 10,
        margin: 5,
        borderRadius: 5,
    },
    filterButtonSelected: {
        backgroundColor: '#5A189A',
    },
    filterButtonText: {
        color: '#5A189A',
        fontWeight: 'bold',
    },
    filterButtonTextSelected: {
        color: '#E6E1FF',
    },
    businessesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        padding: 10,
    },
    businessCard: {
        width: 150,
        height: 180,
        backgroundColor: '#E6E1FF',
        borderRadius: 10,
        margin: 10,
        elevation: 4, // Adds shadow on Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: 22,    // Padding on top
        paddingRight: 10,  // Padding on right
        paddingBottom: 15, // Padding on bottom
        paddingLeft: 10,  
    },
    businessImage: {
        width: '100%',
        height: '70%',
        resizeMode: 'cover',
    },
    businessName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5A189A',
        marginTop: 15,
        textAlign: 'center',

    },
});

export default BrowseBusinesses;
