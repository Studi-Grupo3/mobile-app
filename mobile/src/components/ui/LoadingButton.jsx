import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingButton = ({ isLoading, children, style, disabled, textStyle, ...props }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            disabled={isLoading || disabled}
            style={[
                styles.button,
                (isLoading || disabled) && styles.disabled,
                style
            ]}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color="#000" />
            ) : (
                <Text style={[styles.text, textStyle]}>
                    {children}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        backgroundColor: '#FECB0A',
        width: '100%',
        maxWidth: 320, // md:w-80 -> 320px approx
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {
        opacity: 0.7,
    },
    text: {
        color: 'black',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default LoadingButton;
