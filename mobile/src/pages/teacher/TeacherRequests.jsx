import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Animated } from 'react-native';
import { User, Calendar, Clock, SlidersHorizontal, X, ChevronDown, Check, RefreshCw } from 'lucide-react-native';
import { teacherService } from '../../services/teacherService';
import { translateSubject } from '../../utils/tradutionUtils';

const SUBJECTS = [
    { id: 'ALL', label: 'Todas as matérias' },
    { id: 'MATHEMATICS', label: 'Matemática' },
    { id: 'PORTUGUESE', label: 'Português' },
    { id: 'PHYSICS', label: 'Física' },
    { id: 'CHEMISTRY', label: 'Química' },
    { id: 'BIOLOGY', label: 'Biologia' },
    { id: 'HISTORY', label: 'História' },
    { id: 'GEOGRAPHY', label: 'Geografia' },
    { id: 'ENGLISH', label: 'Inglês' },
    { id: 'SCIENCE', label: 'Ciências' },
];

const STATUSES = [
    { id: 'ALL', label: 'Todos os status' },
    { id: 'SCHEDULED', label: 'Agendado' },
    { id: 'PENDING', label: 'Pendente' },
    { id: 'CONFIRMED', label: 'Confirmado' },
    { id: 'CANCELLED', label: 'Cancelado' },
];

const MODALITIES = [
    { id: 'ALL', label: 'Todas' },
    { id: 'ONLINE', label: 'Online' },
    { id: 'OFFLINE', label: 'Presencial' },
];

const SORT_OPTIONS = [
    { id: 'dateAsc', label: 'Data da aula (próxima)' },
    { id: 'dateDesc', label: 'Data da aula (mais antiga)' },
    { id: 'createdAtDesc', label: 'Agendado recentemente' },
    { id: 'subjectAz', label: 'Matéria A-Z' },
];

const DropdownSelect = ({ label, options, value, onSelect }) => {
    const [open, setOpen] = useState(false);
    const anim = useRef(new Animated.Value(0)).current;
    const itemHeight = 44;
    const menuMaxHeight = Math.min(options.length * itemHeight, 240);
    const selectedLabel = options.find(o => o.id === value)?.label || label;

    const toggle = () => {
        if (open) {
            Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: false }).start(() => setOpen(false));
        } else {
            setOpen(true);
            Animated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: false }).start();
        }
    };

    const maxH = anim.interpolate({ inputRange: [0, 1], outputRange: [0, menuMaxHeight] });
    const rotation = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

    return (
        <View style={styles.dropdownWrapper}>
            <TouchableOpacity style={styles.dropdownTrigger} onPress={toggle} activeOpacity={0.7}>
                <Text style={[styles.dropdownTriggerText, value !== 'ALL' && value !== 'dateAsc' && styles.dropdownTriggerActive]} numberOfLines={1}>
                    {selectedLabel}
                </Text>
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    <ChevronDown size={16} color={value !== 'ALL' && value !== 'dateAsc' ? '#3970B7' : '#94A3B8'} />
                </Animated.View>
            </TouchableOpacity>
            {open && (
                <Animated.View style={[styles.dropdownMenu, { height: maxH }]}>
                    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                        {options.map(opt => (
                            <TouchableOpacity
                                key={opt.id}
                                style={[styles.dropdownItem, value === opt.id && styles.dropdownItemActive]}
                                onPress={() => { onSelect(opt.id); toggle(); }}
                            >
                                <Text style={[styles.dropdownItemText, value === opt.id && styles.dropdownItemTextActive]}>
                                    {opt.label}
                                </Text>
                                {value === opt.id && <Check size={14} color="#3970B7" strokeWidth={3} />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>
            )}
        </View>
    );
};

const Tag = ({ children, colorStyles }) => (
    <View style={[styles.tag, colorStyles]}>
        <Text style={styles.tagText}>{children}</Text>
    </View>
);

export default function TeacherRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [subjectFilter, setSubjectFilter] = useState('ALL');
    const [modalityFilter, setModalityFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('dateAsc');
    const [showFilters, setShowFilters] = useState(false);

    const fetchData = () => {
        setLoading(true);
        teacherService.getPendingLessons()
            .then(data => setRequests(Array.isArray(data) ? data : []))
            .catch(() => setRequests([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return { backgroundColor: '#FEF9C3' };
            case 'SCHEDULED': return { backgroundColor: '#DBEAFE' };
            case 'COMPLETED': return { backgroundColor: '#DCFCE7' };
            case 'CANCELLED': return { backgroundColor: '#FEE2E2' };
            default: return { backgroundColor: '#F3F4F6' };
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'PENDING': return 'Pendente';
            case 'SCHEDULED': return 'Agendado';
            case 'COMPLETED': return 'Concluído';
            case 'CANCELLED': return 'Cancelado';
            default: return status;
        }
    };

    const formatCreatedAt = (dt) => {
        if (!dt) return null;
        const d = new Date(dt);
        if (isNaN(d.getTime())) return null;
        return `Agendado em ${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })} às ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    };

    const getFilteredAndSorted = () => {
        let filtered = [...requests];
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(r => r.status === statusFilter);
        }
        if (subjectFilter !== 'ALL') {
            filtered = filtered.filter(r => r.subject === subjectFilter);
        }
        if (modalityFilter !== 'ALL') {
            if (modalityFilter === 'ONLINE') filtered = filtered.filter(r => r.modality === 'ONLINE' || r.location === 'Online');
            else filtered = filtered.filter(r => r.modality !== 'ONLINE' && r.location !== 'Online');
        }
        switch (sortBy) {
            case 'dateDesc':
                filtered.sort((a, b) => new Date(b.dateTime || `${b.date}T${b.time}` || 0) - new Date(a.dateTime || `${a.date}T${a.time}` || 0));
                break;
            case 'createdAtDesc':
                filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
            case 'subjectAz':
                filtered.sort((a, b) => (translateSubject(a.subject) || '').localeCompare(translateSubject(b.subject) || ''));
                break;
            case 'dateAsc':
            default:
                filtered.sort((a, b) => new Date(a.dateTime || `${a.date}T${a.time}` || 0) - new Date(b.dateTime || `${b.date}T${b.time}` || 0));
                break;
        }
        return filtered;
    };

    const activeFilterCount = [statusFilter, subjectFilter, modalityFilter].filter(f => f !== 'ALL').length;

    const renderItem = ({ item: req }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.subject}>{translateSubject(req.subject)}</Text>
                    <View style={styles.studentRow}>
                        <User size={12} color="gray" />
                        <Text style={styles.studentName}>{req.studentName}</Text>
                    </View>
                </View>
                <View style={styles.tagsContainer}>
                    <Tag colorStyles={getStatusColor(req.status)}>{getStatusLabel(req.status)}</Tag>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoColumn}>
                    <View style={styles.infoRow}>
                        <Calendar size={12} color="gray" />
                        <Text style={styles.infoText}>{req.date}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Clock size={12} color="gray" />
                        <Text style={styles.infoText}>{req.time} • {req.duration} min</Text>
                    </View>
                    {req.message ? (
                        <Text style={styles.motifText}>
                            <Text style={styles.bold}>Mensagem:</Text> {req.message}
                        </Text>
                    ) : null}
                </View>
            </View>

            {formatCreatedAt(req.createdAt) && (
                <View style={styles.createdAtContainer}>
                    <Text style={styles.createdAtText}>{formatCreatedAt(req.createdAt)}</Text>
                </View>
            )}

            <View style={styles.cardFooter}>
                <Text style={styles.dateText}>{req.modality === 'ONLINE' ? 'Online' : 'Presencial'}</Text>
                <TouchableOpacity style={styles.detailsButton}>
                    <Text style={styles.detailsButtonText}>Detalhes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const filteredData = getFilteredAndSorted();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Solicitações</Text>
            </View>

            <View style={styles.filterSection}>
                <TouchableOpacity
                    style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
                    onPress={() => setShowFilters(v => !v)}
                    activeOpacity={0.7}
                >
                    <SlidersHorizontal size={16} color={showFilters ? '#FFF' : '#3970B7'} />
                    <Text style={[styles.filterToggleText, showFilters && styles.filterToggleTextActive]}>
                        Filtros
                    </Text>
                    {activeFilterCount > 0 && (
                        <View style={styles.filterBadge}>
                            <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={fetchData} style={styles.refreshBtn} activeOpacity={0.6}>
                    <RefreshCw size={16} color="#3970B7" />
                </TouchableOpacity>

                {activeFilterCount > 0 && (
                    <TouchableOpacity onPress={() => { setStatusFilter('ALL'); setSubjectFilter('ALL'); setModalityFilter('ALL'); setSortBy('dateAsc'); }} style={styles.clearBtn} activeOpacity={0.6}>
                        <X size={14} color="#EF4444" />
                        <Text style={styles.clearBtnText}>Limpar</Text>
                    </TouchableOpacity>
                )}
            </View>

            {showFilters && (
                <View style={styles.filtersPanel}>
                    <DropdownSelect label="Status" options={STATUSES} value={statusFilter} onSelect={setStatusFilter} />
                    <DropdownSelect label="Matéria" options={SUBJECTS} value={subjectFilter} onSelect={setSubjectFilter} />
                    <DropdownSelect label="Modalidade" options={MODALITIES} value={modalityFilter} onSelect={setModalityFilter} />
                    <DropdownSelect label="Ordenar por" options={SORT_OPTIONS} value={sortBy} onSelect={setSortBy} />
                </View>
            )}

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#3970B7" />
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Nenhuma solicitação encontrada.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    filterSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        gap: 10,
    },
    filterToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    filterToggleActive: {
        backgroundColor: '#3970B7',
        borderColor: '#3970B7',
    },
    filterToggleText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#3970B7',
    },
    filterToggleTextActive: {
        color: '#FFFFFF',
    },
    filterBadge: {
        backgroundColor: '#FECB0A',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 2,
    },
    filterBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#1E293B',
    },
    refreshBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    clearBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    clearBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#EF4444',
    },
    filtersPanel: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginHorizontal: 16,
        marginTop: 10,
        gap: 10,
        elevation: 3,
        shadowColor: '#3970B7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#E8EEF5',
    },
    dropdownWrapper: { zIndex: 1 },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: '#F8FAFC',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dropdownTriggerText: { fontSize: 13, fontWeight: '500', color: '#94A3B8', flex: 1 },
    dropdownTriggerActive: { color: '#1E293B', fontWeight: '600' },
    dropdownMenu: {
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#E8EEF5',
        elevation: 2,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 11,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#F1F5F9',
    },
    dropdownItemActive: { backgroundColor: '#EFF6FF' },
    dropdownItemText: { fontSize: 13, color: '#475569' },
    dropdownItemTextActive: { color: '#3970B7', fontWeight: '600' },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        borderRadius: 8,
        marginBottom: 12, // mb-3
        padding: 12, // p-3
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    subject: {
        fontWeight: '600',
        color: '#111827', // gray-900
        fontSize: 14,
    },
    studentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    studentName: {
        fontSize: 12,
        color: '#374151', // gray-700
        marginLeft: 4,
    },
    tagsContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    tagText: {
        fontSize: 10,
        fontWeight: '600',
    },
    tagYellow: {
        backgroundColor: '#FEF9C3', // yellow-100
    },
    cardBody: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    infoColumn: {
        flex: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 12,
        color: '#374151', // gray-700
        marginLeft: 4,
    },
    motifText: {
        fontSize: 12,
        color: '#374151', // gray-700
        marginTop: 4,
    },
    bold: {
        fontWeight: 'bold',
    },
    rescheduleColumn: {
        flex: 1,
        borderLeftWidth: 1,
        borderLeftColor: '#F3F4F6', // gray-100
        paddingLeft: 8,
    },
    rescheduleTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#374151', // gray-700
        marginBottom: 4,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F9FAFB', // gray-50
    },
    dateText: {
        fontSize: 10,
        color: '#9CA3AF', // gray-400
    },
    detailsButton: {
        borderWidth: 1,
        borderColor: '#D1D5DB', // gray-300
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    detailsButtonText: {
        fontSize: 12,
        color: '#374151', // gray-700
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: '#6B7280',
    },
    createdAtContainer: {
        backgroundColor: '#F0FDF4',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#BBF7D0',
    },
    createdAtText: {
        fontSize: 11,
        color: '#166534',
        fontWeight: '500',
    },
});
