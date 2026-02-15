import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UserAvatar from "./UserAvatar";
import MenuHamburguer from "./MenuHamburguer";
import { ScheduleButton } from "./appointment-manager/ScheduleButton";
import {
    Check,
    AlertCircle,
    User,
    LogOut,
} from "lucide-react-native";
import { authService } from "../services/authService";
import { useUserName } from "../hooks/useUserName";
import { studentService } from "../services/studentService";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function
function isPersonalInfoComplete(student) {
    if (!student) return false;
    const requiredFields = [
        student.name,
        student.email,
        student.dateBirth,
        student.schoolGrade,
        student.schoolName,
        student.cellphoneNumber,
        student.responsible?.responsibleName,
        student.responsible?.kinship,
        student.responsible?.responsibleCpf,
        student.responsible?.responsibleCellphoneNumber,
    ];
    return requiredFields.every(
        (field) => field && String(field).trim().length > 0
    );
}

const NavbarPanel = ({ role, percentComplete = 0 }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [infoPessoaisCompletas, setInfoPessoaisCompletas] = useState(false);
    const navigation = useNavigation();
    const windowWidth = Dimensions.get('window').width;
    const isDesktop = windowWidth >= 768; // md breakpoint

    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [effectiveRole, setEffectiveRole] = useState("");
    const [isTeacher, setIsTeacher] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);

    const { name, loading: nameLoading } = useUserName(userId, userRole);

    useEffect(() => {
        async function loadAuth() {
            const id = await AsyncStorage.getItem("userId");
            const r = await AsyncStorage.getItem("userRole");
            setUserId(id);
            setUserRole(r);

            const eff = (role || r || "").toLowerCase();
            setEffectiveRole(eff);
            setIsTeacher(eff.includes("prof") || eff.includes("teach"));
            setLoadingUser(false);
        }
        loadAuth();
    }, [role]);

    useEffect(() => {
        async function getStatus() {
            if (!userId) return;
            try {
                if (!isTeacher) {
                    const student = await studentService.getById(userId);
                    setInfoPessoaisCompletas(isPersonalInfoComplete(student));
                } else {
                    setInfoPessoaisCompletas(true);
                }
            } catch (err) {
                setInfoPessoaisCompletas(false);
            }
        }
        if (userId && !loadingUser) getStatus();
    }, [userId, isTeacher, loadingUser]);

    const hasPendencias = !infoPessoaisCompletas;

    const handleLogout = async () => {
        try {
            await authService.logout();
            await AsyncStorage.clear();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (error) {
            console.error("Erro ao realizar logout:", error);
        }
    };

    const LogoPlaceholder = () => (
        <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>LOGO</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.content}>

                {/* Mobile Layout */}
                {!isDesktop && (
                    <View style={styles.mobileContainer}>
                        <MenuHamburguer />
                    </View>
                )}

                {/* Desktop Layout */}
                {isDesktop && (
                    <View style={styles.desktopContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                            <LogoPlaceholder />
                        </TouchableOpacity>

                        <View style={styles.linksContainer}>
                            {isTeacher ? (
                                <>
                                    <TouchableOpacity onPress={() => navigation.navigate("TeacherDashboard")}><Text style={styles.linkText}>Início</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate("TeacherClasses")}><Text style={styles.linkText}>Aulas</Text></TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <TouchableOpacity onPress={() => navigation.navigate("StudentDashboard")}><Text style={styles.linkText}>Painel</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate("StudentSchedule")}><Text style={styles.linkText}>Agendamentos</Text></TouchableOpacity>
                                </>
                            )}
                        </View>

                        <View style={styles.profileContainer}>
                            {!isTeacher && <ScheduleButton />}
                            <UserAvatar
                                name={nameLoading ? "" : name}
                                hasNotification={true}
                                isComplete={!hasPendencias}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            />
                        </View>
                    </View>
                )}
            </View>

            {/* Dropdown for User Avatar */}
            {isDropdownOpen && (
                <View style={styles.dropdown}>
                    <View style={styles.dropdownHeader}>
                        <Text style={styles.dropdownName}>{name}</Text>
                        <View style={styles.dropdownStatusRow}>
                            <Text style={styles.dropdownStatusLabel}>Status do perfil</Text>
                            <Text style={[styles.dropdownStatusValue, hasPendencias ? styles.textRed : styles.textGreen]}>
                                {hasPendencias ? "Incompleto" : "Completo"}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.dropdownItem}>
                        <View style={styles.dropdownItemRow}>
                            <User size={20} color="#3b82f6" />
                            <Text style={styles.dropdownItemText}>Informações Pessoais</Text>
                        </View>
                        {infoPessoaisCompletas ? <Check size={20} color="green" /> : <AlertCircle size={20} color="orange" />}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={handleLogout}
                    >
                        <View style={styles.dropdownItemRow}>
                            <LogOut size={20} color="red" />
                            <Text style={styles.logoutText}>Sair da Conta</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#3970B7',
        borderBottomWidth: 4,
        borderBottomColor: '#FECB0A',
        paddingHorizontal: 16,
        paddingVertical: 12,
        zIndex: 50,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    mobileContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    desktopContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',
    },
    logoPlaceholder: {
        height: 40,
        width: 96,
        backgroundColor: '#FACC15', // yellow-400
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginRight: 16,
    },
    logoText: {
        color: '#1E3A8A', // blue-900
        fontWeight: 'bold',
        fontSize: 12,
    },
    linksContainer: {
        flexDirection: 'row',
        gap: 24,
    },
    linkText: {
        color: 'white',
        fontWeight: '600',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    dropdown: {
        position: 'absolute',
        top: 64, // top-16 approx
        right: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        width: 288, // w-72
        zIndex: 50,
        overflow: 'hidden',
    },
    dropdownHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6', // gray-100
    },
    dropdownName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937', // gray-800
    },
    dropdownStatusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    dropdownStatusLabel: {
        fontSize: 12,
        color: '#6B7280', // gray-500
        fontWeight: 'bold',
    },
    dropdownStatusValue: {
        fontSize: 12,
    },
    textRed: { color: '#EF4444' }, // red-500
    textGreen: { color: '#16A34A' }, // green-600
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB', // gray-50
    },
    dropdownItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#1F2937', // gray-800
    },
    logoutText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DC2626', // red-600
    },
});

export default NavbarPanel;
