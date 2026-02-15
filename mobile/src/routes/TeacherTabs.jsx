import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TeacherInitialPage from '../pages/teacher/TeacherInitialPage';
import TeacherClassesPage from '../pages/teacher/TeacherClassesPage';
import TeacherRequests from '../pages/teacher/TeacherRequests';
import TeacherGraph from '../pages/teacher/TeacherGraph';
import ProfilePage from '../pages/common/ProfilePage';
import { Home, BookOpen, Inbox, BarChart2, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export function TeacherTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#3970B7',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E2E8F0',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 6,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={TeacherInitialPage}
                options={{
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                    tabBarLabel: 'Início'
                }}
            />
            <Tab.Screen
                name="Classes"
                component={TeacherClassesPage}
                options={{
                    tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
                    tabBarLabel: 'Aulas'
                }}
            />
            <Tab.Screen
                name="Requests"
                component={TeacherRequests}
                options={{
                    tabBarIcon: ({ color, size }) => <Inbox color={color} size={size} />,
                    tabBarLabel: 'Solicitações'
                }}
            />
            <Tab.Screen
                name="Metrics"
                component={TeacherGraph}
                options={{
                    tabBarIcon: ({ color, size }) => <BarChart2 color={color} size={size} />,
                    tabBarLabel: 'Métricas'
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
