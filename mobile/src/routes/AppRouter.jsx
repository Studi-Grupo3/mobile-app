import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/authContext';
import { AuthStack } from './AuthStack';
import { StudentTabs } from './StudentTabs';
import { TeacherTabs } from './TeacherTabs';
import { AdminDrawer } from './AdminDrawer';
import { GenericScreen } from '../components/GenericScreen';
import AppointmentCreatePage from '../pages/AppointmentCreatePage';
import CompleteStudentRegistrationPage from '../pages/CompleteStudentRegistrationPage';
import CompleteTeacherRegistrationPage from '../pages/CompleteTeacherRegistrationPage';
import ConfirmedPaymentPage from '../pages/ConfirmedPaymentPage';
import CheckoutPage from '../pages/CheckoutPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoadingPage from '../pages/LoadingPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

const Stack = createStackNavigator();

export const AppRouter = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3970B7" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    <Stack.Screen name="Auth" component={AuthStack} />
                ) : user.role === 'ADMIN' ? (
                    <Stack.Screen name="AdminRoot" component={AdminDrawer} />
                ) : user.role === 'TEACHER' ? (
                    <>
                        <Stack.Screen name="TeacherRoot" component={TeacherTabs} />
                        <Stack.Screen name="CompleteTeacherRegistration" component={CompleteTeacherRegistrationPage} />
                    </>
                ) : (
                    // Logic to differentiate Student vs Teacher if needed, else same Tabs with different options
                    // For now assuming Student
                    <>
                        <Stack.Screen name="StudentRoot" component={StudentTabs} />
                        <Stack.Screen name="AppointmentCreate" component={AppointmentCreatePage} />
                        <Stack.Screen name="CompleteStudentRegistration" component={CompleteStudentRegistrationPage} />
                        <Stack.Screen name="ConfirmedPayment" component={ConfirmedPaymentPage} />
                        <Stack.Screen name="Checkout" component={CheckoutPage} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
