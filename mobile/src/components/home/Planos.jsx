import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Planos = () => {
    const navigation = useNavigation();

    const handleSaibaMais = () => {
        navigation.navigate("Register");
    };

    const cards = [
        {
            title: "Ensino Infantil",
            text: "A Studi oferece aulas particulares lúdicas e personalizadas...",
        },
        {
            title: "Ensino Fundamental",
            text: "Neste modelo, as aulas fortalecem a compreensão...",
        },
        {
            title: "Ensino Médio",
            text: "No Ensino Médio, as aulas particulares preparam...",
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.subTitle}>Planos</Text>
                <Text style={styles.mainTitle}>Conheça Nossos Planos</Text>
                <Text style={styles.description}>Oferecemos planos adaptados às necessidades...</Text>
            </View>

            <View style={styles.cardsContainer}>
                {cards.map((card, idx) => (
                    <View key={idx} style={styles.card}>
                        <View style={styles.cardContent}>
                            <View style={styles.imagePlaceholder} />
                            <Text style={styles.cardTitle}>{card.title}</Text>
                            <Text style={styles.cardText}>{card.text}</Text>

                            <TouchableOpacity onPress={handleSaibaMais}>
                                <Text style={styles.cardLink}>Saiba Mais &gt;</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.cardFooter} />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f8f8',
        paddingVertical: 64, // py-16
        paddingHorizontal: 24, // px-6
    },
    header: {
        alignItems: 'center',
        marginBottom: 48, // mb-12
    },
    subTitle: {
        color: '#3970B7',
        fontSize: 18, // text-lg
        fontWeight: '600',
        borderBottomWidth: 2,
        borderBottomColor: '#FECB0A',
        marginBottom: 8,
    },
    mainTitle: {
        color: '#3970B7',
        fontSize: 30, // text-3xl
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    description: {
        color: '#374151', // gray-700
        textAlign: 'center',
    },
    cardsContainer: {
        gap: 32, // gap-8
    },
    card: {
        backgroundColor: '#3970B7',
        borderRadius: 16, // rounded-2xl
        borderWidth: 2,
        borderColor: '#D1D5DB', // gray-300
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        width: '100%',
    },
    cardContent: {
        padding: 24, // p-6
        alignItems: 'center',
    },
    imagePlaceholder: {
        width: '100%',
        height: 144, // h-36
        backgroundColor: '#E5E7EB', // gray-200
        borderRadius: 8,
        marginBottom: 16,
    },
    cardTitle: {
        color: 'white',
        fontSize: 20, // text-xl
        fontWeight: '600',
        marginBottom: 16,
    },
    cardText: {
        color: '#F3F4F6', // gray-100
        fontSize: 14, // text-sm
        textAlign: 'center',
        marginBottom: 20,
    },
    cardLink: {
        color: '#FECB0A',
        fontWeight: 'bold',
    },
    cardFooter: {
        height: 8,
        backgroundColor: '#FECB0A',
    },
});

export default Planos;
