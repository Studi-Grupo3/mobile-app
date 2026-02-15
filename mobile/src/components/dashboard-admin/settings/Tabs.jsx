import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { GeneralSettings } from './GeneralSettings';
import { NotificationSettings } from './NotificationSettings';
import { SecuritySettings } from './SecuritySettings';

const tabs = [
    { key: 'geral', label: 'Geral' },
    { key: 'notificacoes', label: 'Notificações' },
    { key: 'seguranca', label: 'Segurança' }
];

export function Tabs() {
    const [activeTab, setActiveTab] = useState('geral');

    return (
        <View style={styles.container}>
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabContainer}
                >
                    {tabs.map(tab => (
                        <TouchableOpacity
                            key={tab.key}
                            onPress={() => setActiveTab(tab.key)}
                            style={[
                                styles.tabButton,
                                activeTab === tab.key ? styles.activeTabButton : styles.inactiveTabButton
                            ]}
                        >
                            <Text style={[
                                styles.tabText,
                                activeTab === tab.key ? styles.activeTabText : styles.inactiveTabText
                            ]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={styles.contentContainer}>
                {activeTab === 'geral' && <GeneralSettings />}
                {activeTab === 'notificacoes' && <NotificationSettings />}
                {activeTab === 'seguranca' && <SecuritySettings />}
                <View style={styles.spacer} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        paddingHorizontal: 16,
        gap: 12,
        paddingVertical: 12,
    },
    tabButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 2,
    },
    activeTabButton: {
        borderBottomColor: '#3970B7',
    },
    inactiveTabButton: {
        borderBottomColor: 'transparent',
    },
    tabText: {
        fontSize: 14, // text-sm
        fontWeight: 'bold',
    },
    activeTabText: {
        color: 'black',
    },
    inactiveTabText: {
        color: '#6B7280', // gray-500
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#F9FAFB', // gray-50
    },
    spacer: {
        height: 40,
    },
});
