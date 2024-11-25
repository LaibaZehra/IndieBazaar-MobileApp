import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../firebase/firebase"; // Adjust your Firebase import
import BusinessBanner from "../../components/businessbanner/businessbanner";
import BusinessInfo from "../../components/businessinfo/businessinfo";

const BusinessPage = () => {
    const route = useRoute();
    const { id } = route.params; // Retrieve the business ID from route params
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch business details on component mount
    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const docRef = doc(db, "businesses", id); // Reference Firestore document
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setBusiness({ id: docSnap.id, ...docSnap.data() }); // Set business data
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching business: ", error);
            } finally {
                setLoading(false); // Hide loader once data is fetched
            }
        };

        fetchBusiness();
    }, [id]);

    // Show loading spinner while fetching data
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6200EE" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {business ? (
                <>
                    {/* Render business banner */}
                    <BusinessBanner 
                        title={business.name} 
                        slogan={business.slogan || "Welcome to our business!"} 
                    />

                    {/* Render business information */}
                    <BusinessInfo businessId={business.id} />
                </>
            ) : (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Business not found.</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BusinessPage;
