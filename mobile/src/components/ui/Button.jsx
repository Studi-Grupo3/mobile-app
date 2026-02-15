import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export function Button({
    children,
    onClick,
    variant = 'default', // default (indigo), ghost, destructive, primary (blue)
    size = 'md', // sm, md
    disabled = false,
    style,
    ...props
}) {
    // Base styles
    const buttonStyles = [styles.base];

    // Variant styles
    if (variant === 'default') buttonStyles.push(styles.variantDefault);
    else if (variant === 'ghost') buttonStyles.push(styles.variantGhost);
    else if (variant === 'destructive') buttonStyles.push(styles.variantDestructive);
    else if (variant === 'primary') buttonStyles.push(styles.variantPrimary);

    // Size styles
    if (size === 'sm') buttonStyles.push(styles.sizeSm);
    else if (size === 'md') buttonStyles.push(styles.sizeMd);

    // Disabled state
    if (disabled) buttonStyles.push(styles.disabled);

    // External style override
    if (style) buttonStyles.push(style);

    // Text styles logic
    const textStyle = [styles.textBase];

    if (size === 'sm') textStyle.push(styles.textSizeSm);
    else textStyle.push(styles.textSizeMd);

    if (variant === 'ghost') textStyle.push(styles.textGhost);
    else textStyle.push(styles.textWhite);

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClick}
            disabled={disabled}
            style={buttonStyles}
            {...props}
        >
            <Text style={textStyle}>
                {children}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    // Sizes
    sizeSm: {
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    sizeMd: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    // Variants
    variantDefault: {
        backgroundColor: '#4f46e5', // indigo-600
    },
    variantGhost: {
        backgroundColor: 'transparent',
    },
    variantDestructive: {
        backgroundColor: '#dc2626', // red-600
    },
    variantPrimary: {
        backgroundColor: '#3970B7', // custom primary
    },
    disabled: {
        opacity: 0.5,
    },
    // Text variants
    textBase: {
        fontWeight: '500',
    },
    textSizeSm: {
        fontSize: 14,
    },
    textSizeMd: {
        fontSize: 16,
    },
    textWhite: {
        color: '#FFFFFF',
    },
    textGhost: {
        color: '#374151', // gray-700
    },
});
