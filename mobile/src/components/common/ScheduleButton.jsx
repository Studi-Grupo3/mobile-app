import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { CalendarPlus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const ScheduleButton = () => {
    const navigation = useNavigation();

    const handleClick = () => {
        navigation.navigate('AgendarTab');
    };

    return (
        <TouchableOpacity
            onPress={handleClick}
            activeOpacity={0.8}
            style={styles.button}
        >
            <CalendarPlus size={18} color="white" />
            <Text style={styles.text}>Agendar Nova Aula</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#2462C2',
        borderColor: 'white',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
    },
    text: {
        color: 'white',
        fontSize: 12, // text-xs
        fontWeight: '500',
    },
});
