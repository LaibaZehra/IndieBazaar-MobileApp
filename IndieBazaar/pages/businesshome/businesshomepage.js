import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../firebase/firebase";
import BusinessBanner from "../../components/businessbanner/businessbanner";
import BusinessInfo from "../../components/businessinfo/businessinfo";
import { useNavigation } from '@react-navigation/native';

const BusinessPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const { businessId } = route.params || {}; // Safeguard for missing parameter
    const { businessName } = route.params || {};

    useEffect(() => {
        if (!businessId) {
            console.error("Business ID is missing in route parameters");
            return;
        }

        fetchBusiness();
    }, [businessId]);

    useEffect(() => {
        if (businessName) {
            // Update the header title dynamically
            navigation.setOptions({ title: businessName });
        }
    }, [businessName, navigation]);

    const fetchBusiness = async () => {
        try {
            const docRef = doc(db, "businesses", businessId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setBusiness({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.warn("No such document!");
            }
        } catch (error) {
            console.error("Error fetching business: ", error);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6200EE" />
            </View>
        );
    }

    if (!business) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Business not found. Please try again later.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* <BusinessBanner 
                title={business.name} 
                slogan={business.slogan || "Welcome to our business!"} 
            /> */}
            <BusinessInfo businessId={business.id} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#B2E3D8',
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
        color: '#5A189A',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BusinessPage;
