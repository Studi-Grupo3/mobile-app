import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Menu, X } from "lucide-react-native";
import UserAvatar from "./UserAvatar";
import { useNavigation } from '@react-navigation/native';
import { ScheduleButton } from "./appointment-manager/ScheduleButton";
import { SafeAreaView } from 'react-native-safe-area-context';

const MenuHamburguer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigation = useNavigation();

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <X color="white" size={32} />
                    ) : (
                        <Menu color="white" size={32} />
                    )}
                </TouchableOpacity>
            </View>

            <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
                <SafeAreaView style={styles.modalContent}>
                    <View style={styles.closeButtonContainer}>
                        <TouchableOpacity onPress={() => setIsOpen(false)}>
                            <X color="white" size={32} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.menuItems}>
                        <View style={styles.userInfo}>
                            <UserAvatar name="João Carminatti" hasNotification={false} />
                            <Text style={styles.userName}>João Carminatti</Text>
                        </View>

                        {/* Navigation Links */}
                        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                            <Text style={styles.linkText}>Início</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('MeusAgendamentos')}>
                            <Text style={styles.linkText}>Agendamentos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Calendario')}>
                            <Text style={styles.linkText}>Calendário</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Contato')}>
                            <Text style={styles.linkText}>Contato</Text>
                        </TouchableOpacity>

                        <ScheduleButton />
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#3970B7',
    },
    closeButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
    },
    menuItems: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24, // gap-6
        paddingVertical: 24,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    userName: {
        color: 'white',
        fontWeight: '600',
        fontSize: 18, // text-lg
    },
    linkText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 20, // text-xl
    },
});

export default MenuHamburguer;
