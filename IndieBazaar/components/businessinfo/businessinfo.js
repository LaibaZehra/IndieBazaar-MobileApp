import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../firebase/firebase"; // Adjust path as necessary
import { useNavigation } from '@react-navigation/native';

const BusinessInfo = ({ businessId }) => {
    const [businessDescription, setBusinessDescription] = useState('');
    const [randomItems, setRandomItems] = useState([]); // Randomly selected items
    const navigation = useNavigation();

    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                const docRef = doc(db, "businesses", businessId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setBusinessDescription(data.description);

                    const items = data.items || [];
                    const shuffledItems = items.sort(() => 0.5 - Math.random());
                    const selectedItems = shuffledItems.slice(0, 5);
                    setRandomItems(selectedItems);
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching business data: ", error);
            }
        };

        fetchBusinessData();
    }, [businessId]);

    const navigateToProducts = () => {
        navigation.navigate("BusinessProducts", { businessId });
    };

    return (
        <View style={styles.infoContainer}>
            <Text style={styles.aboutTitle}>About Us</Text>
            <Text style={styles.description}>{businessDescription || "Loading..."}</Text>

            <FlatList
                data={randomItems}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                renderItem={({ item }) => (
                    <View style={styles.itemCard}>
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                        <Text style={styles.itemName}>{item.name}</Text>
                    </View>
                )}
                contentContainerStyle={styles.carousel}
            />
            {/* <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.productsButton}>
                    <Text style={styles.productsButtonText}>View More Products</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    infoContainer: {
        padding: 20,
        backgroundColor: '#E6E1FF',
        borderRadius: 10,
        elevation: 3,
    },
    aboutTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#5A189A',
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
        color: '#5A189A',
    },
    carousel: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    itemCard: {
        width: 120,
        alignItems: 'center',
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    itemName: {
        color: '#E6E1FF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    productsButton: {
        backgroundColor: '#5A189A',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: 200,
        marginTop: 10,
    },
    productsButtonText: {
        color: '#E6E1FF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        alignItems: 'center',
    },
});

export default BusinessInfo;
