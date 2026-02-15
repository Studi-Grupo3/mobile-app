import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Home, Users, Calendar, Settings, DollarSign, FileText, UserPlus, User } from 'lucide-react-native';

import VisaoGeralPage from '../pages/admin/VisaoGeralPage';
import AgendamentosPage from '../pages/admin/AgendamentosPage';
import ProfessoresPage from '../pages/admin/ProfessoresPage';
import GerenciamentoProfessoresPage from '../pages/admin/GerenciamentoProfessoresPage';
import PagamentosPage from '../pages/admin/PagamentosPage';
import RelatoriosPage from '../pages/admin/RelatoriosPage';
import ConfiguracoesPage from '../pages/admin/ConfiguracoesPage';
import ProfilePage from '../pages/common/ProfilePage';

const Drawer = createDrawerNavigator();

export function AdminDrawer() {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerTintColor: '#3970B7',
                drawerActiveTintColor: '#3970B7',
                drawerActiveBackgroundColor: '#EFF6FF',
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
                    drawerLabel: 'Professores (Stats)',
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
                name="Relatorios"
                component={RelatoriosPage}
                options={{
                    drawerIcon: ({ color, size }) => <FileText color={color} size={size} />,
                    drawerLabel: 'Relatórios',
                    title: 'Relatórios'
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
            <Drawer.Screen
                name="Perfil"
                component={ProfilePage}
                options={{
                    drawerIcon: ({ color, size }) => <User color={color} size={size} />,
                    drawerLabel: 'Meu Perfil',
                    title: 'Perfil'
                }}
            />
        </Drawer.Navigator>
    );
}
