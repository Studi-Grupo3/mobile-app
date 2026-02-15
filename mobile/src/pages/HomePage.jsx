import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Home from '../components/Home';
import Historia from '../components/Historia';
import Servicos from '../components/Servicos';
import Planos from '../components/Planos';
import ProfessorsSectionHome from '../components/ProfessorsSectionHome';
import FaleConosco from '../components/FaleConosco';
import Footer from '../components/Footer';
import NavbarHome from '../components/NavbarHome';

export default function HomePage() {
    return (
        <View style={styles.container}>
            <NavbarHome />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.blueSection}>
                    <Home />
                </View>

                <View style={styles.graySection}>
                    <Historia />
                    <Servicos />
                    <Planos />
                </View>

                <View style={styles.blueSection}>
                    <ProfessorsSectionHome />
                </View>

                <View style={styles.whiteSection}>
                    <FaleConosco />
                </View>

                <View style={styles.blueSection}>
                    <Footer />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    blueSection: {
        backgroundColor: '#3970B7', // Consistent primary blue
    },
    graySection: {
        backgroundColor: '#f8f8f8',
    },
    whiteSection: {
        backgroundColor: '#FFFFFF',
    },
});
