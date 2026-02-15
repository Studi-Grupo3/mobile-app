import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Menu, X } from "lucide-react-native";

const Logo = () => (
    <View style={styles.logoContainer}>
        <Text style={styles.logoText}>STUDI LOGO</Text>
    </View>
);

const NavbarHome = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigation = useNavigation();

    // In RN Mobile, we don't need "Desktop" view logic. We implement a mobile-first nav.
    // We will just show Logo and Hamburger menu.

    const navItems = [
        { label: "Sobre nós", id: "historia" },
        { label: "Serviços", id: "servicos" },
        { label: "Planos", id: "planos" },
        { label: "Professores", id: "professores" },
        { label: "Contato", id: "contato" },
    ];

    const goTo = (targetId) => {
        setIsOpen(false);
        // Scroll logic would go here if we had Ref to ScrollView
        // For now, no-op or specific page nav
    };

    return (
        <View style={styles.navbar}>
            {/* Logo */}
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Logo />
            </TouchableOpacity>

            {/* Mobile Menu Button */}
            <View>
                <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.menuIcon}>
                    {isOpen ? <X color="white" size={28} /> : <Menu color="white" size={28} />}
                </TouchableOpacity>
            </View>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <View style={styles.dropdown}>
                    <View style={styles.menuItems}>
                        {navItems.map((item) => (
                            <TouchableOpacity key={item.id} onPress={() => goTo(item.id)} style={styles.menuLink}>
                                <Text style={styles.menuLinkText}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.authButtons}>
                        <TouchableOpacity
                            onPress={() => { setIsOpen(false); navigation.navigate("Login"); }}
                            style={styles.loginButton}
                        >
                            <Text style={styles.loginButtonText}>Entrar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setIsOpen(false); navigation.navigate("Register"); }}
                            style={styles.registerButton}
                        >
                            <Text style={styles.registerButtonText}>Cadastre-se</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        width: '100%',
        backgroundColor: '#3970B7',
        borderBottomWidth: 4,
        borderBottomColor: '#FECB0A',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 50,
        position: 'relative', // ensure zIndex works
    },
    logoContainer: {
        height: 40,
        width: 128, // w-32
        backgroundColor: '#FACC15', // yellow-400
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    logoText: {
        color: '#1E40AF', // blue-800
        fontWeight: 'bold',
    },
    menuIcon: {
        padding: 4,
    },
    dropdown: {
        position: 'absolute',
        top: 64, // below navbar
        left: 0,
        right: 0,
        backgroundColor: '#3970B7', // slightly lighter blue for dropdown? #3A6FD8 from original code
        padding: 16,
        zIndex: 100,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    menuItems: {
        gap: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    menuLink: {
        paddingVertical: 8,
    },
    menuLinkText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 18,
    },
    authButtons: {
        gap: 12,
        marginTop: 16,
        width: '100%',
    },
    loginButton: {
        height: 40,
        width: '100%',
        backgroundColor: '#4088E7',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    registerButton: {
        height: 40,
        width: '100%',
        backgroundColor: '#FECB0A',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerButtonText: {
        color: 'black',
        fontWeight: '600',
    },
});

export default NavbarHome;
