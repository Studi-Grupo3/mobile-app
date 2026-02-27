import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudentInitialPage from '../pages/student/StudentInitialPage';
import AppointmentManagerPage from '../pages/student/AppointmentManagerPage';
import ProfilePage from '../pages/common/ProfilePage';
import { Home, Calendar, CalendarPlus, User } from 'lucide-react-native';
import { View, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export function StudentTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#FECB0A',
                tabBarInactiveTintColor: '#8BADD4',
                tabBarStyle: {
                    backgroundColor: '#3970B7',
                    borderTopWidth: 0,
                    height: 62,
                    paddingBottom: 8,
                    paddingTop: 6,
                    elevation: 12,
                    shadowColor: '#1E3A5F',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={StudentInitialPage}
                options={{
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                    tabBarLabel: 'Início'
                }}
            />
            <Tab.Screen
                name="Appointments"
                component={AppointmentManagerPage}
                options={{
                    tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
                    tabBarLabel: 'Agendamentos'
                }}
            />
            <Tab.Screen
                name="AgendarTab"
                component={View}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('AppointmentCreate');
                    },
                })}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <CalendarPlus color={color} size={size} />
                    ),
                    tabBarLabel: 'Agendar',
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfilePage}
                options={{
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                    tabBarLabel: 'Perfil'
                }}
            />
        </Tab.Navigator>
    );
}
