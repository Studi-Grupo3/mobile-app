import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export const TabNav = ({ tabs, activeTab, onChange }) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => onChange(tab.id)}
                        style={[
                            styles.tabItem,
                            activeTab === tab.id ? styles.activeTab : styles.inactiveTab
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab.id ? styles.activeTabText : styles.inactiveTabText
                            ]}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', // gray-200
        marginBottom: 16,
    },
    scrollContent: {
        flexGrow: 1,
    },
    tabItem: {
        paddingVertical: 12, // py-3
        paddingHorizontal: 16, // px-4
        marginRight: 8,
        borderBottomWidth: 2,
    },
    activeTab: {
        borderBottomColor: '#3970B7',
    },
    inactiveTab: {
        borderBottomColor: 'transparent',
    },
    tabText: {
        fontWeight: 'bold',
        fontSize: 14, // text-sm
    },
    activeTabText: {
        color: '#3970B7',
    },
    inactiveTabText: {
        color: '#6B7280', // gray-500
    },
});
