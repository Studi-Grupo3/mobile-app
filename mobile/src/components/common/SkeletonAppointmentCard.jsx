import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export function SkeletonAppointmentCard() {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, [opacity]);

    return (
        <Animated.View style={[styles.container, { opacity }]}>
            <View style={[styles.skeletonLine, styles.width75]} />
            <View style={[styles.skeletonLine, styles.width50]} />
            <View style={[styles.skeletonBox]} />
            <View style={[styles.skeletonLine, styles.width33, styles.selfEnd]} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 16,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    skeletonLine: {
        height: 12, // slightly adjusted h-3/h-4
        backgroundColor: '#D1D5DB', // gray-300
        borderRadius: 4,
        marginBottom: 8,
    },
    skeletonBox: {
        height: 96, // h-24
        backgroundColor: '#D1D5DB', // gray-300
        borderRadius: 4,
        marginBottom: 8,
    },
    width75: { width: '75%', height: 16 },
    width50: { width: '50%' },
    width33: { width: '33%', height: 24 },
    selfEnd: { alignSelf: 'flex-end', marginTop: 'auto' },
});
