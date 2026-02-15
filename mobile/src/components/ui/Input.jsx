import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export function Input({
    label,
    type = 'text',
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    style,
    ...props
}) {
    const isPassword = type === 'password';

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={isPassword || secureTextEntry}
                style={styles.input}
                placeholderTextColor="#9ca3af"
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        flexDirection: 'column',
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '500',
        color: '#374151', // gray-700
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db', // gray-300
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        fontSize: 16,
        color: '#000000',
    },
});
