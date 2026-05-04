import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Home, Users, Calendar, Settings, DollarSign, UserPlus, LogOut } from 'lucide-react-native';
import { AuthContext } from '../context/authContext';
import { AlertModal } from '../components/ui/AlertModal';

import VisaoGeralPage from '../pages/admin/VisaoGeralPage';
import AgendamentosPage from '../pages/admin/AgendamentosPage';
import ProfessoresPage from '../pages/admin/ProfessoresPage';
import GerenciamentoProfessoresPage from '../pages/admin/GerenciamentoProfessoresPage';
import PagamentosPage from '../pages/admin/PagamentosPage';
import ConfiguracoesPage from '../pages/admin/ConfiguracoesPage';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    const { logout } = useContext(AuthContext);
    const [logoutAlert, setLogoutAlert] = useState(false);

    const handleLogout = () => {
        setLogoutAlert(true);
    };

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <TouchableOpacity style={drawerStyles.logoutButton} onPress={handleLogout}>
                <LogOut size={20} color="#EF4444" />
                <Text style={drawerStyles.logoutText}>Sair da conta</Text>
            </TouchableOpacity>
            <AlertModal
                visible={logoutAlert}
                type="warning"
                title="Sair"
                message="Deseja realmente sair da conta?"
                onClose={() => setLogoutAlert(false)}
                buttons={[
                    { text: 'Cancelar', style: 'cancel', onPress: () => setLogoutAlert(false) },
                    { text: 'Sair', style: 'destructive', onPress: async () => { setLogoutAlert(false); await logout(); } },
                ]}
            />
        </View>
    );
}

const drawerStyles = StyleSheet.create({
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingBottom: 28,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 12,
    },
    logoutText: {
        color: '#EF4444',
        fontWeight: '700',
        fontSize: 14,
    },
});

export function AdminDrawer() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#3970B7',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: '600',
                },
                drawerActiveTintColor: '#FFFFFF',
                drawerActiveBackgroundColor: '#3970B7',
                drawerInactiveTintColor: '#64748B',
                drawerStyle: {
                    backgroundColor: '#FFFFFF',
                },
                drawerLabelStyle: {
                    fontWeight: '600',
                    fontSize: 14,
                },
            }}
        >
            <Drawer.Screen
                name="VisaoGeral"
                component={VisaoGeralPage}
                options={{
                    drawerIcon: ({ color, size }) => <Home color={color} size={size} />,
                    drawerLabel: 'Visão Geral',
                    title: 'Visão Geral'
                }}
            />
            <Drawer.Screen
                name="Agendamentos"
                component={AgendamentosPage}
                options={{
                    drawerIcon: ({ color, size }) => <Calendar color={color} size={size} />,
                    drawerLabel: 'Agendamentos',
                    title: 'Agendamentos'
                }}
            />
            <Drawer.Screen
                name="ProfessoresStats"
                component={ProfessoresPage}
                options={{
                    drawerIcon: ({ color, size }) => <Users color={color} size={size} />,
                    drawerLabel: 'Professores',
                    title: 'Professores'
                }}
            />
            <Drawer.Screen
                name="GerenciarProfessores"
                component={GerenciamentoProfessoresPage}
                options={{
                    drawerIcon: ({ color, size }) => <UserPlus color={color} size={size} />,
                    drawerLabel: 'Gerenciar Prof.',
                    title: 'Gerenciar Professores'
                }}
            />
            <Drawer.Screen
                name="Pagamentos"
                component={PagamentosPage}
                options={{
                    drawerIcon: ({ color, size }) => <DollarSign color={color} size={size} />,
                    drawerLabel: 'Pagamentos',
                    title: 'Pagamentos'
                }}
            />
            <Drawer.Screen
                name="Configuracoes"
                component={ConfiguracoesPage}
                options={{
                    drawerIcon: ({ color, size }) => <Settings color={color} size={size} />,
                    drawerLabel: 'Configurações',
                    title: 'Configurações'
                }}
            />
        </Drawer.Navigator>
    );
}
