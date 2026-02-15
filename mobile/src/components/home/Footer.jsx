import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Phone, Mail } from "lucide-react-native";
import { useNavigation } from '@react-navigation/native';

const LogoPlaceholder = () => (
    <View style={styles.logoPlaceholder}>
        <Text style={styles.logoText}>STUDI</Text>
    </View>
);

const Footer = () => {
    const navigation = useNavigation();

    const openLink = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const navigateTo = (screen) => {
        navigation.navigate(screen);
    };

    const goToSection = (section) => {
        // Placeholder nav
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <View style={styles.columnContainer}>

                {/* Logo */}
                <View style={styles.column}>
                    <LogoPlaceholder />
                </View>

                {/* Links Rápidos */}
                <View style={styles.column}>
                    <Text style={styles.heading}>Links Rápidos</Text>
                    <View style={styles.linkList}>
                        <TouchableOpacity onPress={() => goToSection("historia")}>
                            <Text style={styles.linkText}>Sobre Nós</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => goToSection("planos")}>
                            <Text style={styles.linkText}>Planos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => goToSection("professores")}>
                            <Text style={styles.linkText}>Professores</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigateTo("Register")}>
                            <Text style={styles.linkText}>Cadastre-se</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Áreas de Ensino */}
                <View style={styles.column}>
                    <Text style={styles.heading}>Áreas De Ensino</Text>
                    <View style={styles.linkList}>
                        <Text style={styles.text}>E. Fundamental</Text>
                        <Text style={styles.text}>E. Fundamental 2</Text>
                        <Text style={styles.text}>E. Médio</Text>
                        <Text style={styles.text}>Vestibulares</Text>
                    </View>
                </View>

                {/* Contato */}
                <View style={styles.column}>
                    <Text style={styles.heading}>Contato</Text>
                    <View style={styles.contactList}>
                        <TouchableOpacity
                            onPress={() => openLink("https://wa.me/5511983458739")}
                            style={styles.contactItem}
                        >
                            <Phone size={20} color="white" />
                            <Text style={styles.contactText}>(11) 98345-8739</Text>
                        </TouchableOpacity>

                        <View style={styles.contactItem}>
                            <Mail size={20} color="white" />
                            <Text style={styles.contactText}>mamasantolin@gmail.com</Text>
                        </View>
                    </View>
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3970B7',
        borderTopWidth: 2,
        borderTopColor: '#FDE047', // yellow-300
        paddingVertical: 32,
        paddingHorizontal: 16,
    },
    columnContainer: {
        gap: 32,
        width: '100%',
    },
    column: {
        alignItems: 'center', // Mobile center alignment
    },
    logoPlaceholder: {
        height: 64,
        width: 128,
        backgroundColor: '#1E40AF', // blue-800
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginBottom: 16,
    },
    logoText: {
        color: 'white',
        fontWeight: 'bold',
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#FDE047', // yellow-300
        paddingBottom: 4,
        width: '100%',
        textAlign: 'center',
    },
    linkList: {
        marginTop: 12,
        gap: 8,
        alignItems: 'center',
    },
    linkText: {
        color: 'white',
    },
    text: {
        color: 'white',
    },
    contactList: {
        marginTop: 12,
        gap: 12,
        alignItems: 'center',
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    contactText: {
        color: 'white',
        fontSize: 14,
    },
});

export default Footer;
