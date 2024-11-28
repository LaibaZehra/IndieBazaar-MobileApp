import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import DropDown from '../../components/dropdown/dropdown';
import { useNavigation } from '@react-navigation/native';

import accessory from '../../assets/acc.jpg';
import food from '../../assets/food.jpg';
import clothes from '../../assets/clothes.jpg';
import decor from '../../assets/decor.jpg';
import Health from '../../assets/health.jpg';
import book from '../../assets/books.jpg';
import handmade from '../../assets/handmade.jpg';
import stationary from '../../assets/stationary.jpg';

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

    const handleCategoryClick = (category) => {
        navigation.navigate('Browse', { selectedCategory: category.name });
    };

    return (
        <View style={styles.container}>
            <DropDown
                options={categories.map((category) => category.name)}
                onSelect={(selectedCategory) => {
                    console.log('Selected category:', selectedCategory);
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
        backgroundColor: '#B2E3D8',
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        padding: 10,
    },
    categoryCard: {
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
    categoryImage: {
        width: '100%',
        height: '70%',
        resizeMode: 'cover',
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5A189A',
        marginTop: 20,
        textAlign: 'center',
    },
});

export default CategoriesPage;
