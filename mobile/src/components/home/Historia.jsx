import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Heart, Users, Award, BookOpen } from "lucide-react-native";
import SaibaMaisButton from "./SaibaMaisButton";

const Historia = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    return (
        <View style={[styles.container, visible ? styles.visible : styles.hidden]}>
            <View style={styles.illustrationBox}>
                <View style={styles.illustrationMain}>
                    <Heart size={40} color="#3970B7" />
                </View>
                <View style={[styles.illustrationSmall, { top: 16, right: 30 }]}>
                    <Users size={18} color="#FECB0A" />
                </View>
                <View style={[styles.illustrationSmall, { bottom: 20, left: 25 }]}>
                    <Award size={18} color="#3970B7" />
                </View>
                <View style={[styles.illustrationSmall, { top: 30, left: 40 }]}>
                    <BookOpen size={16} color="#FECB0A" />
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>
                        Sobre nós
                    </Text>
                </View>

                <Text style={styles.mainTitle}>
                    Conheça Nossa História
                </Text>

                <Text style={styles.text}>
                    A Studi nasceu com o propósito de oferecer um suporte acadêmico
                    personalizado para alunos que precisam de acompanhamento mais
                    individualizado.
                </Text>

                <Text style={styles.text}>
                    Desde o início, nossa missão foi criar um ambiente de aprendizado
                    acolhedor e eficaz.
                </Text>

                <Text style={styles.quote}>
                    Transformando vidas pela educação desde 2018
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 48, // py-12
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 16,
    },
    visible: {
        opacity: 1,
    },
    hidden: {
        opacity: 0,
    },
    imagePlaceholder: {
        width: '100%',
        backgroundColor: '#DBEAFE',
        height: 192,
        marginBottom: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    illustrationBox: {
        width: '100%',
        backgroundColor: '#EFF6FF',
        height: 180,
        marginBottom: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    illustrationMain: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#3970B7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    illustrationSmall: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#3B82F6',
        fontWeight: 'bold',
    },
    content: {
        width: '100%',
    },
    sectionTitleContainer: {
        alignSelf: 'flex-start',
        borderBottomWidth: 2,
        borderBottomColor: '#FECB0A',
        paddingBottom: 4,
        marginBottom: 16,
    },
    sectionTitle: {
        color: '#3970B7',
        fontWeight: 'bold',
        fontSize: 12, // text-xs
        textTransform: 'uppercase',
    },
    mainTitle: {
        fontSize: 24, // text-2xl
        fontWeight: 'bold',
        color: '#3970B7',
        marginBottom: 16,
    },
    text: {
        color: '#4B5563', // gray-600
        marginBottom: 16,
        lineHeight: 24, // leading-relaxed
        fontSize: 16, // text-base
    },
    quote: {
        color: '#374151', // gray-700
        fontWeight: '600',
        fontStyle: 'italic',
        fontSize: 16,
        marginTop: 8,
    },
});

export default Historia;
