import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { db } from '../../firebase/firebase'; // Your Firebase setup
import DropDown from '../../components/dropdown/dropdown';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

const BrowseBusinesses = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { selectedCategory } = route.params || {}; // Get selected category from navigation params

    const [businesses, setBusinesses] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(selectedCategory ? [selectedCategory] : []);
    const [loading, setLoading] = useState(false);

    const allCategories = ['Food', 'Accessories', 'Clothes', 'Decor', 'Health', 'Book', 'Stationary', 'Handmade'];

    // Fetch businesses from Firebase
    const fetchBusinesses = async () => {
        setLoading(true);
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
            const fetchedBusinesses = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setBusinesses(fetchedBusinesses);
        } catch (error) {
            console.error('Error fetching businesses: ', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch businesses when selectedCategories changes
    useEffect(() => {
        fetchBusinesses();
    }, [selectedCategories]);

    useFocusEffect(
        React.useCallback(() => {
            // Reset categories when screen is focused
            setSelectedCategories(selectedCategory ? [selectedCategory] : []);
        }, [selectedCategory])
    );

    // Filtered businesses based on the selected business name
    const filteredBusinesses = useMemo(() => {
        if (selectedBusiness) {
            return businesses.filter(business => business.name === selectedBusiness);
        }
        return businesses;
    }, [selectedBusiness, businesses]);

    const handleBusinessClick = (business) => {
        navigation.navigate('BusinessHome', { businessId: business.id, businessName: business.name });
    };

    return (
        <View style={styles.container}>
            <DropDown
                options={businesses.map(business => business.name)}
                onSelect={setSelectedBusiness}
                placeholder="Select a business"
            />
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
            {loading && <ActivityIndicator size="large" color="#5A189A" style={styles.loadingIndicator} />}
            {!loading && (
                <FlatList
                    data={filteredBusinesses}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.businessesContainer}
                    ListEmptyComponent={<Text style={styles.businessName}>No businesses found in this category.</Text>}
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
            )}
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
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: 22,
        paddingRight: 10,
        paddingBottom: 15,
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
        marginTop: 10,
        textAlign: 'center',
    },
    loadingIndicator: {
        marginTop: 20,
    },
});

export default BrowseBusinesses;
