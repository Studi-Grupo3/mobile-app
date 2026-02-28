import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { BookOpen, Star } from 'lucide-react-native';
import Logo from '../../../assets/logo.svg';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
    const logoScale = useRef(new Animated.Value(0.3)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const subtitleTranslateY = useRef(new Animated.Value(20)).current;
    const dotScale1 = useRef(new Animated.Value(0)).current;
    const dotScale2 = useRef(new Animated.Value(0)).current;
    const dotScale3 = useRef(new Animated.Value(0)).current;
    const progressWidth = useRef(new Animated.Value(0)).current;
    const screenOpacity = useRef(new Animated.Value(1)).current;

    // Floating particles
    const particle1Y = useRef(new Animated.Value(0)).current;
    const particle2Y = useRef(new Animated.Value(0)).current;
    const particle3Y = useRef(new Animated.Value(0)).current;
    const particle1Opacity = useRef(new Animated.Value(0.3)).current;
    const particle2Opacity = useRef(new Animated.Value(0.2)).current;
    const particle3Opacity = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        // Floating particles - continuous
        const floatParticle = (animValue, duration) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(animValue, { toValue: -20, duration, useNativeDriver: true }),
                    Animated.timing(animValue, { toValue: 0, duration, useNativeDriver: true }),
                ])
            );
        };

        floatParticle(particle1Y, 2000).start();
        floatParticle(particle2Y, 2500).start();
        floatParticle(particle3Y, 1800).start();

        // Particle opacity pulse
        const pulseOpacity = (animValue, min, max, duration) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.timing(animValue, { toValue: max, duration, useNativeDriver: true }),
                    Animated.timing(animValue, { toValue: min, duration, useNativeDriver: true }),
                ])
            );
        };
        pulseOpacity(particle1Opacity, 0.1, 0.5, 1500).start();
        pulseOpacity(particle2Opacity, 0.1, 0.4, 2000).start();
        pulseOpacity(particle3Opacity, 0.2, 0.6, 1200).start();

        // Main intro sequence
        Animated.sequence([
            // 1. Logo appears with scale bounce
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 4,
                    tension: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
            // 2. Subtitle slides in
            Animated.parallel([
                Animated.timing(subtitleOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(subtitleTranslateY, {
                    toValue: 0,
                    friction: 6,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]),
            // 4. Loading dots
            Animated.stagger(200, [
                Animated.spring(dotScale1, { toValue: 1, friction: 3, tension: 60, useNativeDriver: true }),
                Animated.spring(dotScale2, { toValue: 1, friction: 3, tension: 60, useNativeDriver: true }),
                Animated.spring(dotScale3, { toValue: 1, friction: 3, tension: 60, useNativeDriver: true }),
            ]),
            // 5. Progress bar
            Animated.timing(progressWidth, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: false,
            }),
            // 6. Fade out
            Animated.timing(screenOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onFinish && onFinish();
        });
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
            {/* Decorative gradient-like layers */}
            <View style={styles.bgLayer1} />
            <View style={styles.bgLayer2} />

            {/* Floating particles */}
            <Animated.View style={[styles.particle, styles.particle1, { transform: [{ translateY: particle1Y }], opacity: particle1Opacity }]}>
                <BookOpen size={24} color="#FECB0A" />
            </Animated.View>
            <Animated.View style={[styles.particle, styles.particle2, { transform: [{ translateY: particle2Y }], opacity: particle2Opacity }]}>
                <Star size={18} color="#FECB0A" />
            </Animated.View>
            <Animated.View style={[styles.particle, styles.particle3, { transform: [{ translateY: particle3Y }], opacity: particle3Opacity }]}>
                <Star size={28} color="#FECB0A" />
            </Animated.View>

            {/* Main content */}
            <View style={styles.centerContent}>
                {/* Logo */}
                <Animated.View style={[styles.logoContainer, {
                    transform: [{ scale: logoScale }],
                    opacity: logoOpacity,
                }]}>
                    <View style={styles.logoWrapper}>
                        <Logo
                            width={320}
                            height={186}
                            preserveAspectRatio="xMidYMid meet"
                        />
                    </View>
                </Animated.View>

                {/* Subtitle */}
                <Animated.View style={{
                    opacity: subtitleOpacity,
                    transform: [{ translateY: subtitleTranslateY }],
                }}>
                    <Text style={styles.subtitle}>Seu caminho para o sucesso</Text>
                    <Text style={styles.subsubtitle}>começa aqui</Text>
                </Animated.View>

                {/* Loading dots */}
                <View style={styles.dotsContainer}>
                    {[dotScale1, dotScale2, dotScale3].map((dot, i) => (
                        <Animated.View
                            key={i}
                            style={[styles.dot, { transform: [{ scale: dot }] }]}
                        />
                    ))}
                </View>

                {/* Progress bar */}
                <View style={styles.progressBarContainer}>
                    <Animated.View style={[styles.progressBar, {
                        width: progressWidth.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                        }),
                    }]} />
                </View>
            </View>

            {/* Bottom branding */}
            <View style={styles.bottomBrand}>
                <Text style={styles.bottomText}>Aulas Particulares</Text>
                <View style={styles.bottomLine} />
                <Text style={styles.versionText}>v1.0.0</Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3970B7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bgLayer1: {
        position: 'absolute',
        top: -height * 0.2,
        right: -width * 0.3,
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
    bgLayer2: {
        position: 'absolute',
        bottom: -height * 0.15,
        left: -width * 0.2,
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.3,
        backgroundColor: 'rgba(254, 203, 10, 0.06)',
    },
    particle: {
        position: 'absolute',
    },
    particle1: {
        top: height * 0.15,
        left: width * 0.1,
    },
    particle2: {
        top: height * 0.25,
        right: width * 0.15,
    },
    particle3: {
        bottom: height * 0.25,
        right: width * 0.2,
    },
    centerContent: {
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 32,
        alignItems: 'center',
        overflow: 'visible',
    },
    logoWrapper: {
        width: 320,
        height: 186,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
    },
    subtitle: {
        fontSize: 16,
        color: '#FECB0A',
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '500',
        letterSpacing: 1,
    },
    subsubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        marginTop: 4,
        fontWeight: '300',
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 40,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FECB0A',
    },
    progressBarContainer: {
        width: 200,
        height: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 2,
        marginTop: 20,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FECB0A',
        borderRadius: 2,
    },
    bottomBrand: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    bottomText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 13,
        letterSpacing: 2,
        fontWeight: '500',
    },
    bottomLine: {
        width: 40,
        height: 1,
        backgroundColor: 'rgba(254, 203, 10, 0.4)',
        marginVertical: 8,
    },
    versionText: {
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: 11,
    },
});
