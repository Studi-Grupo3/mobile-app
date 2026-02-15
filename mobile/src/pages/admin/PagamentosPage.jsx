import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { StatCard } from '../../components/admin/StatCard';
import { ToggleSwitch } from '../../components/ui/ToggleSwitch';
import { paymentDashService } from '../../services/dashboard/paymentDashService';
import { CreditCard, Wallet } from 'lucide-react-native';

export default function PagamentosPage() {
    const [stats, setStats] = useState({
        totalAmount: 0,
        pendingAmount: 0,
        realizedAmount: 0,
        averageAmountPerTeacher: 0
    });
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [onlyPending, setOnlyPending] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                // Mock month/year 
                const [statsData, recentData] = await Promise.all([
                    paymentDashService.getStats(2, 2025), // dynamic date needed
                    paymentDashService.getRecent(2, 2025)
                ]);
                setStats(statsData);
                setPayments(recentData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const toggleStatus = async (item) => {
        try {
            await paymentDashService.toggleStatus(item.id, 2, 2025);
            // Reload
            const [statsData, recentData] = await Promise.all([
                paymentDashService.getStats(2, 2025),
                paymentDashService.getRecent(2, 2025)
            ]);
            setStats(statsData);
            setPayments(recentData);
        } catch (e) {
            Alert.alert("Erro", "Falha ao atualizar status");
        }
    };

    const filtered = payments.filter(p => !onlyPending || p.status === 'Pendente');

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#3970B7" /></View>;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.pageTitle}>Pagamentos</Text>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <StatCard title={`R$ ${stats.totalAmount}`} subtitle="Total" icon={<CreditCard size={20} color="#3970B7" />} />
                </View>
                <View style={styles.statItem}>
                    <StatCard title={`R$ ${stats.pendingAmount}`} subtitle="Pendentes" icon={<Wallet size={20} color="#3970B7" />} />
                </View>
            </View>

            <View style={styles.filterContainer}>
                <ToggleSwitch value={onlyPending} onValueChange={setOnlyPending} />
                <Text style={styles.filterText}>Somente pendentes</Text>
            </View>

            {filtered.map(item => (
                <View key={item.id} style={styles.paymentCard}>
                    <View>
                        <Text style={styles.paymentName}>{item.name}</Text>
                        <Text style={styles.paymentStatus}>{item.status}</Text>
                    </View>
                    <ToggleSwitch
                        value={item.status === 'Pago'}
                        onValueChange={() => toggleStatus(item)}
                    />
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // gray-100
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: 24, // text-2xl
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
        marginBottom: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 16,
    },
    statItem: {
        width: '47%',
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    filterText: {
        marginLeft: 8,
        color: '#374151', // gray-700
    },
    paymentCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paymentName: {
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
    },
    paymentStatus: {
        fontSize: 14, // text-sm
        color: '#6B7280', // gray-500
    },
});
