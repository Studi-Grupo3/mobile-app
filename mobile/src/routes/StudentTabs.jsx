import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import StudentInitialPage from '../pages/student/StudentInitialPage';
import AppointmentManagerPage from '../pages/student/AppointmentManagerPage';
import AppointmentCreatePage from '../pages/student/AppointmentCreatePage';
import ProfilePage from '../pages/common/ProfilePage';
import CompleteStudentRegistrationPage from '../pages/student/CompleteStudentRegistrationPage';
import ConfirmedPaymentPage from '../pages/student/ConfirmedPaymentPage';
import CheckoutPage from '../pages/student/CheckoutPage';
import { Home, Calendar, CalendarPlus, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ProfileStudentStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileMain" component={ProfilePage} />
            <Stack.Screen name="CompleteStudentRegistration" component={CompleteStudentRegistrationPage} />
        </Stack.Navigator>
    );
}

function AgendarStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AgendarMain" component={AppointmentCreatePage} />
            <Stack.Screen name="ConfirmedPayment" component={ConfirmedPaymentPage} />
            <Stack.Screen name="Checkout" component={CheckoutPage} />
        </Stack.Navigator>
    );
}

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
                    height: 65,
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
                    marginTop: -2,
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
                component={AgendarStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <CalendarPlus color={color} size={size} />
                    ),
                    tabBarLabel: 'Agendar',
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('AgendarTab', { screen: 'AgendarMain' });
                    },
                })}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileStudentStack}
                options={{
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                    tabBarLabel: 'Perfil'
                }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Profile', { screen: 'ProfileMain' });
                    },
                })}
            />
        </Tab.Navigator>
    );
}
