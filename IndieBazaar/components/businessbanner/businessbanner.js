import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const BusinessBanner = ({ title, slogan }) => {
    return (
        <View style={styles.bannerContainer}>
            <Text style={styles.title}>{title}</Text>
            {slogan ? <Text style={styles.slogan}>{slogan}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    bannerContainer: {
        backgroundColor: '#6200EE',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    slogan: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default BusinessBanner;
