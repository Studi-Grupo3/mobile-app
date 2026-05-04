import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    CreditCard, Clock, CheckCircle, XCircle, ChevronRight,
    DollarSign, Calendar, Filter
} from 'lucide-react-native';
import { appointmentService } from '../../services/appointmentService';
import { authService } from '../../services/authService';
import { translateSubject } from '../../utils/tradutionUtils';

const statusConfig = {
    PAID: { label: 'Pago', color: '#10B981', bg: '#ECFDF5', icon: CheckCircle },
    PENDING: { label: 'Pendente', color: '#F59E0B', bg: '#FFFBEB', icon: Clock },
    CANCELLED: { label: 'Cancelado', color: '#EF4444', bg: '#FEF2F2', icon: XCircle },
};

export default function StudentPaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const studentId = await authService.getUserId();
                const appointments = await appointmentService.getByStudentId(studentId);
                const mapped = (appointments || []).map(a => ({
                    id: a.id,
                    description: `Aula de ${translateSubject(a.subject) || a.subject}`,
                    teacher: a.teacherName || a.teacher?.name || 'Professor',
                    date: a.dateTime ? a.dateTime.split('T')[0] : '',
                    amount: a.totalValue || 0,
                    status: a.paymentStatus || 'PENDING',
                }));
                setPayments(mapped);
            } catch (err) {
                console.warn('StudentPaymentsPage: erro ao buscar pagamentos', err.message);
                setPayments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    const filtered = activeFilter === 'ALL'
        ? payments
        : payments.filter(p => p.status === activeFilter);

    const totalPaid = payments
        .filter(p => p.status === 'PAID')
        .reduce((acc, p) => acc + p.amount, 0);

    const totalPending = payments
        .filter(p => p.status === 'PENDING')
        .reduce((acc, p) => acc + p.amount, 0);

    const formatCurrency = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

    const formatDate = (dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    const filters = [
        { key: 'ALL', label: 'Todos' },
        { key: 'PAID', label: 'Pagos' },
        { key: 'PENDING', label: 'Pendentes' },
        { key: 'CANCELLED', label: 'Cancelados' },
    ];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Pagamentos</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Summary Cards */}
                <View style={styles.summaryRow}>
                    <View style={[styles.summaryCard, { borderLeftColor: '#10B981' }]}>
                        <View style={[styles.summaryIconBox, { backgroundColor: '#ECFDF5' }]}>
                            <CheckCircle size={18} color="#10B981" />
                        </View>
                        <Text style={styles.summaryLabel}>Total Pago</Text>
                        <Text style={[styles.summaryValue, { color: '#10B981' }]}>{formatCurrency(totalPaid)}</Text>
                    </View>
                    <View style={[styles.summaryCard, { borderLeftColor: '#F59E0B' }]}>
                        <View style={[styles.summaryIconBox, { backgroundColor: '#FFFBEB' }]}>
                            <Clock size={18} color="#F59E0B" />
                        </View>
                        <Text style={styles.summaryLabel}>Pendente</Text>
                        <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>{formatCurrency(totalPending)}</Text>
                    </View>
                </View>

                {/* Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContainer}
                >
                    {filters.map(f => (
                        <TouchableOpacity
                            key={f.key}
                            style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
                            onPress={() => setActiveFilter(f.key)}
                        >
                            <Text style={[
                                styles.filterChipText,
                                activeFilter === f.key && styles.filterChipTextActive,
                            ]}>
                                {f.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Payments List */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#3970B7" />
                    </View>
                ) : filtered.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <CreditCard size={48} color="#CBD5E1" />
                        <Text style={styles.emptyText}>Nenhum pagamento encontrado</Text>
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        {filtered.map((payment) => {
                            const status = statusConfig[payment.status];
                            const StatusIcon = status.icon;
                            return (
                                <TouchableOpacity
                                    key={payment.id}
                                    style={styles.paymentCard}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.paymentIcon, { backgroundColor: status.bg }]}>
                                        <StatusIcon size={20} color={status.color} />
                                    </View>
                                    <View style={styles.paymentInfo}>
                                        <Text style={styles.paymentDesc}>{payment.description}</Text>
                                        <Text style={styles.paymentTeacher}>{payment.teacher}</Text>
                                        <View style={styles.paymentMeta}>
                                            <Calendar size={12} color="#94A3B8" />
                                            <Text style={styles.paymentDate}>{formatDate(payment.date)}</Text>
                                            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                                                <Text style={[styles.statusText, { color: status.color }]}>
                                                    {status.label}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Text style={[styles.paymentAmount, { color: status.color }]}>
                                        {formatCurrency(payment.amount)}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E293B',
    },
    scrollView: {
        flex: 1,
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 14,
        padding: 16,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    summaryIconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 2,
    },
    filtersContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 4,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    filterChipActive: {
        backgroundColor: '#3970B7',
        borderColor: '#3970B7',
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    filterChipTextActive: {
        color: '#FFF',
    },
    loadingContainer: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    emptyContainer: {
        paddingVertical: 60,
        alignItems: 'center',
        gap: 12,
    },
    emptyText: {
        fontSize: 15,
        color: '#94A3B8',
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingTop: 12,
        gap: 8,
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 14,
        padding: 14,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
    },
    paymentIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentDesc: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    paymentTeacher: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 1,
    },
    paymentMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    paymentDate: {
        fontSize: 11,
        color: '#94A3B8',
        marginRight: 6,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
    },
    paymentAmount: {
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 8,
    },
});
