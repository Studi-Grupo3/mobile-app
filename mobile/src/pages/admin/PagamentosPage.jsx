import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { StatCard } from '../../components/admin/StatCard';
import { ToggleSwitch } from '../../components/ui/ToggleSwitch';
import { mockPaymentDashService as paymentDashService } from '../../mocks/mockServices';
import { DollarSign, CreditCard, Wallet, TrendingUp } from 'lucide-react-native';
import { translateSubject, translatePaymentStatus } from '../../utils/tradutionUtils';

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
                const [statsData, recentData] = await Promise.all([
                    paymentDashService.getStats(2, 2025),
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

    const doToggle = async (item) => {
        try {
            await paymentDashService.toggleStatus(item.id, 2, 2025);
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

    const toggleStatus = (item) => {
        const isPaid = item.status === 'Pago' || item.status === 'PAID';
        const action = isPaid ? 'Pendente' : 'Pago';
        Alert.alert(
            'Confirmar alteração',
            `Deseja marcar o pagamento de ${item.name} como "${action}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar', onPress: () => doToggle(item) },
            ]
        );
    };

    const filtered = payments.filter(p => !onlyPending || p.status === 'Pendente' || p.status === 'PENDING');

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#3970B7" /></View>;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <StatCard
                title={`R$ ${Number(stats.totalAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                subtitle="Total"
                icon={<DollarSign size={20} color="#3970B7" />}
            />
            <StatCard
                title={`R$ ${Number(stats.realizedAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                subtitle="Realizado"
                icon={<CreditCard size={20} color="#22C55E" />}
            />
            <StatCard
                title={`R$ ${Number(stats.pendingAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                subtitle="Pendente"
                icon={<Wallet size={20} color="#E8A317" />}
            />
            <StatCard
                title={`R$ ${Number(stats.averageAmountPerTeacher).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                subtitle="Média por Professor"
                icon={<TrendingUp size={20} color="#3970B7" />}
            />

            <View style={styles.filterContainer}>
                <ToggleSwitch checked={onlyPending} onChange={setOnlyPending} />
                <Text style={styles.filterText}>Somente pendentes</Text>
            </View>

            {filtered.length === 0 && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum pagamento encontrado.</Text>
                </View>
            )}

            {filtered.map(item => {
                const isPaid = item.status === 'Pago' || item.status === 'PAID';
                const statusLabel = translatePaymentStatus(item.status);
                return (
                    <View key={item.id} style={styles.paymentCard}>
                        <View style={styles.paymentHeader}>
                            <Text style={styles.paymentName}>{item.name}</Text>
                            <ToggleSwitch
                                checked={isPaid}
                                onChange={() => toggleStatus(item)}
                            />
                        </View>
                        <Text style={styles.paymentSubject}>{translateSubject(item.subject)}</Text>
                        <View style={styles.paymentDetails}>
                            <View style={styles.paymentDetailItem}>
                                <Text style={styles.detailLabel}>Valor/Hora</Text>
                                <Text style={styles.detailValue}>R$ {Number(item.valuePerHour).toFixed(2)}</Text>
                            </View>
                            <View style={styles.paymentDetailItem}>
                                <Text style={styles.detailLabel}>Horas</Text>
                                <Text style={styles.detailValue}>{item.hours}h</Text>
                            </View>
                            <View style={styles.paymentDetailItem}>
                                <Text style={styles.detailLabel}>Total</Text>
                                <Text style={[styles.detailValue, { fontWeight: '700' }]}>R$ {Number(item.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
                            </View>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: isPaid ? '#DCFCE7' : '#FEF9C3' }]}>
                            <Text style={{ color: isPaid ? '#166534' : '#92400E', fontSize: 11, fontWeight: '700' }}>{statusLabel}</Text>
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 12,
    },
    filterText: {
        marginLeft: 8,
        color: '#374151',
        fontWeight: '600',
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    paymentCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    paymentName: {
        fontWeight: '700',
        color: '#1F2937',
        fontSize: 15,
    },
    paymentSubject: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 12,
    },
    paymentDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    paymentDetailItem: {
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '500',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
});
