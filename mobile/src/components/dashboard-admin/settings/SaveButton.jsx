import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Save } from 'lucide-react-native';

export function SaveButton({ onClick, label = "Salvar", style }) {
    return (
        <TouchableOpacity
            onPress={onClick}
            style={[styles.button, style]}
        >
            <Save size={18} color="white" />
            <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#3970B7',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24, // px-
        paddingVertical: 12, // py-3
        borderRadius: 8, // rounded-lg
        gap: 8,
    },
    text: {
        color: 'white', // text-white
        fontWeight: 'bold', // font-bold
        fontSize: 14, // text-sm
    },
});
