import React, { useContext, useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    Image, Alert, Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
    User, LogOut, ChevronRight, Bell, Shield,
    CreditCard, FileText, HelpCircle, Settings, BookOpen, Edit3
} from 'lucide-react-native';
import { AuthContext } from '../../context/authContext';

const { width } = Dimensions.get('window');

export default function ProfilePage() {
    const { user, logout } = useContext(AuthContext);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [profileData, setProfileData] = useState(null);

    const isStudent = user?.role === 'STUDENT';
    const isTeacher = user?.role === 'TEACHER';
    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        // Mock profile data based on role
        if (isStudent) {
            setProfileData({
                name: 'Estudante Teste',
                email: 'aluno@studi.com',
                avatar: null,
                role: 'Aluno',
                memberSince: 'Jan 2025',
                completedClasses: 12,
                registrationComplete: false,
            });
        } else if (isTeacher) {
            setProfileData({
                name: 'Professor Teste',
                email: 'professor@studi.com',
                avatar: null,
                role: 'Professor',
                memberSince: 'Mar 2024',
                totalClasses: 87,
                rating: 4.8,
                registrationComplete: false,
            });
        } else {
            setProfileData({
                name: 'Administrador',
                email: 'admin@studi.com',
                avatar: null,
                role: 'Administrador',
                memberSince: 'Jan 2024',
            });
        }
    }, [user]);

    const handleLogout = () => {
        Alert.alert(
            'Sair da conta',
            'Tem certeza que deseja sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                    },
                },
            ]
        );
    };

    const handleCompleteRegistration = () => {
        if (isStudent) {
            navigation.navigate('CompleteStudentRegistration');
        } else if (isTeacher) {
            navigation.navigate('CompleteTeacherRegistration');
        }
    };

    const getRoleColor = () => {
        if (isAdmin) return '#EF4444';
        if (isTeacher) return '#8B5CF6';
        return '#3970B7';
    };

    const getRoleLabel = () => {
        if (isAdmin) return 'Administrador';
        if (isTeacher) return 'Professor';
        return 'Aluno';
    };

    const menuSections = [];

    // Registration Section (student/teacher only)
    if ((isStudent || isTeacher) && profileData && !profileData.registrationComplete) {
        menuSections.push({
            title: 'Cadastro',
            items: [
                {
                    icon: Edit3,
                    label: 'Completar Cadastro',
                    subtitle: 'Finalize seu perfil para usar todos os recursos',
                    onPress: handleCompleteRegistration,
                    highlight: true,
                },
            ],
        });
    }

    // Account section
    menuSections.push({
        title: 'Conta',
        items: [
            {
                icon: User,
                label: 'Dados Pessoais',
                subtitle: 'Nome, email, telefone',
                onPress: () => handleCompleteRegistration(),
            },
            {
                icon: Shield,
                label: 'Segurança',
                subtitle: 'Senha e privacidade',
                onPress: () => {},
            },
            {
                icon: Bell,
                label: 'Notificações',
                subtitle: 'Preferências de notificação',
                onPress: () => {},
            },
        ],
    });

    // Student-specific
    if (isStudent) {
        menuSections.push({
            title: 'Estudos',
            items: [
                {
                    icon: BookOpen,
                    label: 'Meus Materiais',
                    subtitle: 'PDFs e recursos baixados',
                    onPress: () => {},
                },
                {
                    icon: CreditCard,
                    label: 'Pagamentos',
                    subtitle: 'Histórico e faturas',
                    onPress: () => navigation.navigate('Payments'),
                },
            ],
        });
    }

    // Teacher-specific
    if (isTeacher) {
        menuSections.push({
            title: 'Profissional',
            items: [
                {
                    icon: FileText,
                    label: 'Materiais dos Alunos',
                    subtitle: 'PDFs compartilhados',
                    onPress: () => {},
                },
                {
                    icon: CreditCard,
                    label: 'Meus Ganhos',
                    subtitle: 'Pagamentos recebidos',
                    onPress: () => {},
                },
            ],
        });
    }

    // Support section
    menuSections.push({
        title: 'Suporte',
        items: [
            {
                icon: HelpCircle,
                label: 'Ajuda e FAQ',
                subtitle: 'Perguntas frequentes',
                onPress: () => {},
            },
            {
                icon: Settings,
                label: 'Configurações',
                subtitle: 'Preferências do app',
                onPress: () => {},
            },
        ],
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Perfil</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        {profileData?.avatar ? (
                            <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatarPlaceholder, { backgroundColor: getRoleColor() }]}>
                                <User size={36} color="#FFF" />
                            </View>
                        )}
                        <View style={[styles.roleBadge, { backgroundColor: getRoleColor() }]}>
                            <Text style={styles.roleBadgeText}>{getRoleLabel()}</Text>
                        </View>
                    </View>
                    <Text style={styles.profileName}>{profileData?.name || 'Carregando...'}</Text>
                    <Text style={styles.profileEmail}>{profileData?.email || ''}</Text>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        {isStudent && (
                            <>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{profileData?.completedClasses || 0}</Text>
                                    <Text style={styles.statLabel}>Aulas</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{profileData?.memberSince}</Text>
                                    <Text style={styles.statLabel}>Membro desde</Text>
                                </View>
                            </>
                        )}
                        {isTeacher && (
                            <>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{profileData?.totalClasses || 0}</Text>
                                    <Text style={styles.statLabel}>Aulas</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{profileData?.rating || '-'}</Text>
                                    <Text style={styles.statLabel}>Avaliação</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{profileData?.memberSince}</Text>
                                    <Text style={styles.statLabel}>Desde</Text>
                                </View>
                            </>
                        )}
                        {isAdmin && (
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{profileData?.memberSince}</Text>
                                <Text style={styles.statLabel}>Membro desde</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Menu Sections */}
                {menuSections.map((section, sectionIdx) => (
                    <View key={sectionIdx} style={styles.menuSection}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.menuCard}>
                            {section.items.map((item, itemIdx) => (
                                <TouchableOpacity
                                    key={itemIdx}
                                    style={[
                                        styles.menuItem,
                                        itemIdx < section.items.length - 1 && styles.menuItemBorder,
                                        item.highlight && styles.menuItemHighlight,
                                    ]}
                                    onPress={item.onPress}
                                    activeOpacity={0.6}
                                >
                                    <View style={[
                                        styles.menuIconContainer,
                                        item.highlight && styles.menuIconHighlight,
                                    ]}>
                                        <item.icon size={20} color={item.highlight ? '#FECB0A' : '#3970B7'} />
                                    </View>
                                    <View style={styles.menuTextContainer}>
                                        <Text style={[styles.menuLabel, item.highlight && styles.menuLabelHighlight]}>
                                            {item.label}
                                        </Text>
                                        {item.subtitle && (
                                            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                                        )}
                                    </View>
                                    <ChevronRight size={18} color="#CBD5E1" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <LogOut size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Sair da conta</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Studi App v1.0.0</Text>
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
    profileCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    roleBadge: {
        position: 'absolute',
        bottom: -4,
        alignSelf: 'center',
        paddingHorizontal: 12,
        paddingVertical: 3,
        borderRadius: 10,
    },
    roleBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
        marginTop: 8,
    },
    profileEmail: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        width: '100%',
        justifyContent: 'center',
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#3970B7',
    },
    statLabel: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#E2E8F0',
    },
    menuSection: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
        marginLeft: 4,
    },
    menuCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    menuItemHighlight: {
        backgroundColor: '#FFFBEB',
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuIconHighlight: {
        backgroundColor: '#3970B7',
    },
    menuTextContainer: {
        flex: 1,
    },
    menuLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
    },
    menuLabelHighlight: {
        color: '#3970B7',
        fontWeight: '700',
    },
    menuSubtitle: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 1,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: 16,
        marginTop: 24,
        paddingVertical: 14,
        backgroundColor: '#FFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 15,
        fontWeight: '600',
    },
    version: {
        textAlign: 'center',
        color: '#CBD5E1',
        fontSize: 12,
        marginTop: 16,
        marginBottom: 8,
    },
});
