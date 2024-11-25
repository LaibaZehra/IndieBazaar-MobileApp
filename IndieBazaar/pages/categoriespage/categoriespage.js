import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
// import NavBar from '../components/NavBar'; // Adapted NavBar component for React Native
import DropDown from '../../components/dropdown/dropdown'; // Adapted DropDown component for React Native
import { useNavigation } from '@react-navigation/native';

import accessory from '../../assets/acc.jpg';
import food from '../../assets/food.jpg';
import clothes from '../../assets/clothes.jpg';
import decor from '../../assets/decor.jpg';
import Health from '../../assets/health.jpg';
import book from '../../assets/books.jpg';
import handmade from '../../assets/handmade.jpg';
import stationary from '../../assets/stationary.jpg';
import mainlogo from '../../assets/logoimage.jpg';

const CategoriesPage = () => {
    const navigation = useNavigation();

    const categories = [
        { name: 'Food', image: food },
        { name: 'Accessories', image: accessory },
        { name: 'Clothes', image: clothes },
        { name: 'Decor', image: decor },
        { name: 'Health', image: Health },
        { name: 'Book', image: book },
        { name: 'Stationary', image: stationary },
        { name: 'Handmade', image: handmade },
    ];

    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleCategoryClick = (category) => {
        navigation.navigate('Browse', { categories: [category.name] });
    };

    return (
        <View style={styles.container}>
            {/* <NavBar title="IndieBazaar" logoSrc={mainlogo} /> */}
            <DropDown
                options={categories.map((category) => category.name)} // Pass category names as options
                onSelect={(selectedCategory) => {
                    console.log('Selected category:', selectedCategory);
                    // Navigate or filter based on the selected category
                    handleCategorySelect(selectedCategory);
                }}
                placeholder="Select a category"
            />
            <ScrollView contentContainerStyle={styles.categoriesContainer}>
                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.categoryCard}
                        onPress={() => handleCategoryClick(category)}
                    >
                        <Image source={category.image} style={styles.categoryImage} />
                        <Text style={styles.categoryName}>{category.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        padding: 10,
    },
    categoryCard: {
        width: 160,
        height: 200,
        backgroundColor: '#FFF',
        borderRadius: 10,
        margin: 10,
        elevation: 4, // Adds shadow on Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
        overflow: 'hidden',
    },
    categoryImage: {
        width: '100%',
        height: '70%',
        resizeMode: 'cover',
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
});

export default CategoriesPage;
