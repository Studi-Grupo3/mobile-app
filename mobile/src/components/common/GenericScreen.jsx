import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const GenericScreen = ({ route }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Screen: {route.name}</Text>
            <Text style={styles.subText}>Work in Progress</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subText: {
        fontSize: 14,
        color: '#666',
    },
});
