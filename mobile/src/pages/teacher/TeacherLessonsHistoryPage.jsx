import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Animated, StyleSheet } from 'react-native';
import { SlidersHorizontal, X, ChevronDown, Check, RefreshCw } from 'lucide-react-native';
import TabelaAulas from '../../components/teacher/TabelaAulas';
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
    { id: 'COMPLETED', label: 'Concluídas' },
    { id: 'CANCELLED', label: 'Canceladas' },
];

const SORT_OPTIONS = [
    { id: 'dateDesc', label: 'Mais recente' },
    { id: 'dateAsc', label: 'Mais antiga' },
    { id: 'createdAtDesc', label: 'Agendado recentemente' },
    { id: 'subjectAz', label: 'Matéria A-Z' },
];

const DropdownSelect = ({ label, options, value, onSelect }) => {
    const [open, setOpen] = useState(false);
    const anim = useRef(new Animated.Value(0)).current;
    const menuMaxHeight = Math.min(options.length * 44, 240);
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
                <Text style={[styles.dropdownTriggerText, value !== 'ALL' && value !== 'dateDesc' && styles.dropdownTriggerActive]} numberOfLines={1}>
                    {selectedLabel}
                </Text>
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    <ChevronDown size={16} color={value !== 'ALL' && value !== 'dateDesc' ? '#3970B7' : '#94A3B8'} />
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

export default function TeacherLessonsHistoryPage() {
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [subjectFilter, setSubjectFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('dateDesc');
    const [showFilters, setShowFilters] = useState(false);

    const fetchData = () => {
        setLoading(true);
        teacherService.getLessonsHistory()
            .then(data => setHistorico(Array.isArray(data) ? data : []))
            .catch(() => setHistorico([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const getFilteredAndSorted = () => {
        let filtered = [...historico];
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(r => r.status === statusFilter);
        }
        if (subjectFilter !== 'ALL') {
            filtered = filtered.filter(r => r.subject === subjectFilter);
        }
        switch (sortBy) {
            case 'dateAsc':
                filtered.sort((a, b) => new Date(a.dateTime || `${a.date}T${a.time}` || 0) - new Date(b.dateTime || `${b.date}T${b.time}` || 0));
                break;
            case 'createdAtDesc':
                filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
            case 'subjectAz':
                filtered.sort((a, b) => (translateSubject(a.subject) || '').localeCompare(translateSubject(b.subject) || ''));
                break;
            case 'dateDesc':
            default:
                filtered.sort((a, b) => new Date(b.dateTime || `${b.date}T${b.time}` || 0) - new Date(a.dateTime || `${a.date}T${a.time}` || 0));
                break;
        }
        return filtered;
    };

    const activeFilterCount = [statusFilter, subjectFilter].filter(f => f !== 'ALL').length;
    const filteredData = getFilteredAndSorted();

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Aulas ministradas</Text>
                <Text style={styles.subtitle}>
                    Histórico de aulas concluídas e canceladas.
                </Text>

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
                        <TouchableOpacity onPress={() => { setStatusFilter('ALL'); setSubjectFilter('ALL'); setSortBy('dateDesc'); }} style={styles.clearBtn} activeOpacity={0.6}>
                            <X size={14} color="#EF4444" />
                            <Text style={styles.clearBtnText}>Limpar</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {showFilters && (
                    <View style={styles.filtersPanel}>
                        <DropdownSelect label="Status" options={STATUSES} value={statusFilter} onSelect={setStatusFilter} />
                        <DropdownSelect label="Matéria" options={SUBJECTS} value={subjectFilter} onSelect={setSubjectFilter} />
                        <DropdownSelect label="Ordenar por" options={SORT_OPTIONS} value={sortBy} onSelect={setSortBy} />
                    </View>
                )}

                {loading ? (
                    <ActivityIndicator size="large" color="#3970B7" />
                ) : (
                    <TabelaAulas aulas={filteredData} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#1F2937',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
    },
    filterSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10,
    },
    filterToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#F8FAFC',
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
        backgroundColor: '#F8FAFC',
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
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        gap: 10,
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
        backgroundColor: '#FFFFFF',
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
});
