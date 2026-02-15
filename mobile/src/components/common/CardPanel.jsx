import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CardPanelItem = ({ title, description }) => {
    const backgroundColors = {
        "Completar Cadastro": "#FFF5F5",
        "Agendamentos": "#EFF6FF",
        "Pagamentos": "#FCFDF0"
    };

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: backgroundColors[title] || '#fff' }
            ]}
        >
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6', // gray-100
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    title: {
        fontSize: 18, // text-lg
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#1F2937', // gray-800
    },
    description: {
        fontSize: 14, // text-sm
        color: '#4B5563', // gray-600
    },
});

export default CardPanelItem;
