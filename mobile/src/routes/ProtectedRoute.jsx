import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/authContext';
// In RN, we usually control access via the Navigator structure itself (AppRouter).
// However, if we need a component that wraps children and checks auth explicitly:

export const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3970B7" />
            </View>
        );
    }

    if (!user) {
        // In web we redirect. In RN, usually logic is handled in Router.
        // But if this component renders null, the user sees nothing.
        // Ideally we shouldn't use this component inside Navigation screens if the Router already handles it.
        // But for completeness:
        return null;
    }

    if (requiredRole && user.role !== requiredRole) {
        return null;
    }

    return children;
};
