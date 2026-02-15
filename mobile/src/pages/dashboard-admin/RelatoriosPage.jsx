import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChartSection } from '../../components/dashboard-admin/ChartSection';
import { financeCharts, studentCharts, classCharts } from '../../data/data-chart/reportCharts';
import { ReportCard } from '../../components/dashboard-admin/reports/ReportCard';

export default function RelatoriosPage() {
    const [tab, setTab] = useState('financeiro');

    const renderChart = () => {
        switch (tab) {
            case 'financeiro': return <ChartSection charts={financeCharts} />;
            case 'alunos': return <ChartSection charts={studentCharts} />;
            case 'aulas': return <ChartSection charts={classCharts} />;
            default: return null;
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.pageTitle}>Relatórios</Text>

            <View style={styles.summarySection}>
                <Text style={styles.sectionTitle}>Resumos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.summaryCardWrapper}>
                        <ReportCard title="Financeiro" description="Dados financeiros completos..." />
                    </View>
                    <View style={styles.summaryCardWrapper}>
                        <ReportCard title="Professores" description="Resumo de desempenho..." />
                    </View>
                </ScrollView>
            </View>

            <View style={styles.tabsContainer}>
                {['financeiro', 'alunos', 'aulas'].map(t => (
                    <TouchableOpacity
                        key={t}
                        onPress={() => setTab(t)}
                        style={[
                            styles.tabButton,
                            tab === t && styles.activeTab
                        ]}
                    >
                        <Text style={[
                            styles.tabText,
                            tab === t ? styles.activeTabText : styles.inactiveTabText
                        ]}>
                            {t}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {renderChart()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // gray-100
        padding: 16,
    },
    pageTitle: {
        fontSize: 24, // text-2xl
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
        marginBottom: 24,
    },
    summarySection: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#374151', // gray-700
    },
    summaryCardWrapper: {
        marginRight: 16,
        width: 256, // w-64
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#E5E7EB', // gray-200
        padding: 4,
        borderRadius: 8,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: 'white',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    tabText: {
        textTransform: 'capitalize',
    },
    activeTabText: {
        fontWeight: 'bold',
        color: '#3970B7',
    },
    inactiveTabText: {
        color: '#6B7280', // gray-500
    },
});
