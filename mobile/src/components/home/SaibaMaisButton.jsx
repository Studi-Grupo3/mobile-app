import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const SaibaMaisButton = ({ onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={styles.button}
        >
            <Text style={styles.text}>
                Saiba Mais →
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#FECB0A',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'black',
    },
    text: {
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SaibaMaisButton;
