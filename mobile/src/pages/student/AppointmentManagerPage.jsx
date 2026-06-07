import React, { useState, useRef } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Animated,
    ScrollView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ChevronDown, SlidersHorizontal, X, Check, RefreshCw, ArrowUpDown,
} from 'lucide-react-native';
import { UpcomingAppointments } from '../../components/student/appointment-manager/UpcomingAppointments';
import { AllAppointments } from '../../components/student/appointment-manager/AllAppointments';
import { CalendarView } from '../../components/student/appointment-manager/CalendarView';

// ── subject list (matches subjectNamesPt keys) ──
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

const STATUSES_UPCOMING = [
    { id: 'ALL', label: 'Todos os status' },
    { id: 'CONFIRMED', label: 'Confirmadas' },
    { id: 'CANCELLED', label: 'Canceladas' },
];

const STATUSES_HISTORY = [
    { id: 'ALL', label: 'Todos os status' },
    { id: 'COMPLETED', label: 'Concluídas' },
    { id: 'CANCELLED', label: 'Canceladas' },
    { id: 'CONFIRMED', label: 'Agendadas' },
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

// ── Tab Nav ──
const TabNav = ({ tabs, activeTab, onChange }) => (
    <View style={styles.tabNavContainer}>
        {tabs.map(tab => (
            <TouchableOpacity
                key={tab.id}
                onPress={() => onChange(tab.id)}
                style={[
                    styles.tabButton,
                    activeTab === tab.id && styles.activeTabButton,
                ]}
            >
                <Text style={[
                    styles.tabText,
                    activeTab === tab.id ? styles.activeTabText : styles.inactiveTabText,
                ]}>
                    {tab.label}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

// ── Dropdown Select Component ──
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
                <Text style={[styles.dropdownTriggerText, value !== 'ALL' && styles.dropdownTriggerActive]} numberOfLines={1}>
                    {selectedLabel}
                </Text>
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    <ChevronDown size={16} color={value !== 'ALL' ? '#3970B7' : '#94A3B8'} />
                </Animated.View>
            </TouchableOpacity>
            {open && (
                <Animated.View style={[styles.dropdownMenu, { height: maxH }]}>
                    <ScrollView
                        style={styles.dropdownScroll}
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.dropdownScrollContent}
                    >
                        {options.map(opt => (
                            <TouchableOpacity
                                key={opt.id}
                                style={[styles.dropdownItem, value === opt.id && styles.dropdownItemActive]}
                                onPress={() => { onSelect(opt.id); toggle(); }}
                                activeOpacity={0.6}
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

export default function AppointmentManagerPage() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [subjectFilter, setSubjectFilter] = useState('ALL');
    const [modalityFilter, setModalityFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('dateAsc');
    const [showFilters, setShowFilters] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const tabs = [
        { id: 'upcoming', label: 'Próximas' },
        { id: 'past', label: 'Histórico' },
        { id: 'calendar', label: 'Calendário' },
    ];

    const resetFilters = () => {
        setStatusFilter('ALL');
        setSubjectFilter('ALL');
        setModalityFilter('ALL');
        setSortBy('dateAsc');
    };

    const handleTabChange = (t) => {
        setActiveTab(t);
        resetFilters();
        setShowFilters(false);
    };

    const handleRefresh = () => {
        setRefreshKey(k => k + 1);
    };

    const activeFilterCount = [statusFilter, subjectFilter, modalityFilter].filter(f => f !== 'ALL').length;

    const compositeFilter = { status: statusFilter, subject: subjectFilter, modality: modalityFilter };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Meus Agendamentos</Text>
            </View>

            <View style={styles.content}>
                <TabNav tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

                {/* Filter toggle */}
                {activeTab !== 'calendar' && (
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

                        <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn} activeOpacity={0.6}>
                            <RefreshCw size={16} color="#3970B7" />
                        </TouchableOpacity>

                        {activeFilterCount > 0 && (
                            <TouchableOpacity onPress={resetFilters} style={styles.clearBtn} activeOpacity={0.6}>
                                <X size={14} color="#EF4444" />
                                <Text style={styles.clearBtnText}>Limpar</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Dropdown filters panel */}
                {showFilters && activeTab !== 'calendar' && (
                    <View style={styles.filtersPanel}>
                        <DropdownSelect
                            label="Status"
                            options={activeTab === 'upcoming' ? STATUSES_UPCOMING : STATUSES_HISTORY}
                            value={statusFilter}
                            onSelect={setStatusFilter}
                        />
                        <DropdownSelect
                            label="Matéria"
                            options={SUBJECTS}
                            value={subjectFilter}
                            onSelect={setSubjectFilter}
                        />
                        <DropdownSelect
                            label="Modalidade"
                            options={MODALITIES}
                            value={modalityFilter}
                            onSelect={setModalityFilter}
                        />
                        <DropdownSelect
                            label="Ordenar por"
                            options={SORT_OPTIONS}
                            value={sortBy}
                            onSelect={setSortBy}
                        />
                    </View>
                )}

                {/* Content */}
                <View style={styles.tabContent}>
                    {activeTab === 'upcoming' && (
                        <UpcomingAppointments key={refreshKey} filter={compositeFilter} sortBy={sortBy} />
                    )}
                    {activeTab === 'past' && (
                        <AllAppointments key={refreshKey} filter={compositeFilter} sortBy={sortBy} />
                    )}
                    {activeTab === 'calendar' && (
                        <CalendarView key={refreshKey} filter={compositeFilter} setActiveTab={setActiveTab} />
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },
    header: {
        backgroundColor: '#3970B7',
        paddingHorizontal: 20,
        paddingVertical: 18,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
        padding: 16,
        paddingBottom: 0,
    },
    tabNavContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 4,
        borderRadius: 12,
        marginBottom: 14,
        justifyContent: 'space-around',
        elevation: 2,
        shadowColor: '#3970B7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    activeTabButton: {
        backgroundColor: '#3970B7',
    },
    tabText: {
        fontWeight: '600',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    inactiveTabText: {
        color: '#64748B',
    },
    // ── Filter section ──
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
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
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
    clearBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    refreshBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    clearBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#EF4444',
    },
    // ── Filters panel ──
    filtersPanel: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        gap: 10,
        elevation: 3,
        shadowColor: '#3970B7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#E8EEF5',
    },
    // ── Dropdown ──
    dropdownWrapper: {
        zIndex: 1,
    },
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
    dropdownTriggerText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#94A3B8',
        flex: 1,
    },
    dropdownTriggerActive: {
        color: '#1E293B',
        fontWeight: '600',
    },
    dropdownMenu: {
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#E8EEF5',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    dropdownScroll: {
        height: '100%',
    },
    dropdownScrollContent: {
        paddingVertical: 2,
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
    dropdownItemActive: {
        backgroundColor: '#EFF6FF',
    },
    dropdownItemText: {
        fontSize: 13,
        color: '#475569',
    },
    dropdownItemTextActive: {
        color: '#3970B7',
        fontWeight: '600',
    },
    tabContent: {
        flex: 1,
    },
});
