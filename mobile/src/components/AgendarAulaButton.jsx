import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const AgendarAulaButton = ({ onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={styles.button}
        >
            <Text style={styles.text}>
                📅 Agendar Aula →
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AgendarAulaButton;
