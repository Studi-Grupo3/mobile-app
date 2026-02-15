import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { UpcomingAppointments } from '../../components/student/appointment-manager/UpcomingAppointments';
import { AllAppointments } from '../../components/student/appointment-manager/AllAppointments';
import { Calendar } from 'lucide-react-native';

const TabNav = ({ tabs, activeTab, onChange }) => (
    <View style={styles.tabNavContainer}>
        {tabs.map(tab => (
            <TouchableOpacity
                key={tab.id}
                onPress={() => onChange(tab.id)}
                style={[
                    styles.tabButton,
                    activeTab === tab.id && styles.activeTabButton
                ]}
            >
                <Text style={[
                    styles.tabText,
                    activeTab === tab.id ? styles.activeTabText : styles.inactiveTabText
                ]}>
                    {tab.label}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

export default function AppointmentManagerPage() {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [filter, setFilter] = useState('ALL');

    const tabs = [
        { id: 'upcoming', label: 'Próximas' },
        { id: 'past', label: 'Histórico' },
        { id: 'calendar', label: 'Calendário' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Meus Agendamentos</Text>
            </View>

            <View style={styles.content}>
                <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {activeTab === 'upcoming' && (
                        <UpcomingAppointments filter={filter} setFilter={setFilter} />
                    )}
                    {activeTab === 'past' && (
                        <AllAppointments filter={filter} setFilter={setFilter} />
                    )}
                    {activeTab === 'calendar' && (
                        <View style={styles.calendarPlaceholder}>
                            <Calendar size={48} color="gray" />
                            <Text style={styles.calendarText}>Visualização de calendário em breve.</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // gray-50
    },
    header: {
        backgroundColor: 'white',
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', // gray-200
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937', // gray-800
    },
    content: {
        flex: 1,
        padding: 16,
    },
    tabNavContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 8,
        marginBottom: 16,
        justifyContent: 'space-around',
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    activeTabButton: {
        backgroundColor: '#DBEAFE', // blue-100
    },
    tabText: {
        fontWeight: '600',
    },
    activeTabText: {
        color: '#1D4ED8', // blue-700
    },
    inactiveTabText: {
        color: '#6B7280', // gray-500
    },
    scrollContent: {
        paddingBottom: 20,
    },
    calendarPlaceholder: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    calendarText: {
        color: '#6B7280', // gray-500
        marginTop: 16,
    },
});
