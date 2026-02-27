import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { usePreferenceId } from '../../hooks/payments/usePreferenceId';
import { CreditCard, ExternalLink } from 'lucide-react-native';

export default function CheckoutPage() {
    const route = useRoute();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const { amount = 100, payerEmail = 'cliente@teste.com' } = route.params || {};

    const { preferenceId, loading, error } = usePreferenceId(amount, payerEmail);
    const [paymentStatus, setPaymentStatus] = useState(null);

    const handleOpenPayment = async () => {
        if (!preferenceId) return;

        const url = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${preferenceId}`;

        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
            Alert.alert(
                "Pagamento",
                "Após concluir o pagamento no MercadoPago, clique em 'Verificar Status' (Simulação)",
                [
                    { text: "OK", onPress: () => setPaymentStatus("Aguardando confirmação...") }
                ]
            );
        } else {
            Alert.alert("Erro", "Não foi possível abrir o link de pagamento.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <CreditCard size={48} color="#3970B7" style={styles.icon} />
                <Text style={styles.title}>Finalizar Compra</Text>
                <Text style={styles.amountText}>
                    Valor total: R$ {Number(amount).toFixed(2).replace('.', ',')}
                </Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#3970B7" />
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    <TouchableOpacity
                        onPress={handleOpenPayment}
                        style={styles.payButton}
                    >
                        <Text style={styles.payButtonText}>Pagar com Mercado Pago</Text>
                        <ExternalLink size={16} color="white" />
                    </TouchableOpacity>
                )}

                {paymentStatus && (
                    <View style={styles.statusBox}>
                        <Text style={styles.statusText}>{paymentStatus}</Text>
                    </View>
                )}

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.cancelButton}
                >
                    <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // gray-50
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 12, // rounded-xl
        elevation: 10, // shadow-lg
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        width: '100%',
        maxWidth: 384, // max-w-sm
        alignItems: 'center',
    },
    icon: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20, // text-xl
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
        marginBottom: 8,
    },
    amountText: {
        color: '#4B5563', // gray-600
        marginBottom: 24,
        textAlign: 'center',
        fontSize: 16,
    },
    errorText: {
        color: '#EF4444', // red-500
        textAlign: 'center',
        marginBottom: 16,
    },
    payButton: {
        backgroundColor: '#009EE3', // MP Blue
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '100%',
        marginBottom: 16,
    },
    payButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginRight: 8,
    },
    statusBox: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#EFF6FF', // blue-50
        borderRadius: 8,
        width: '100%',
    },
    statusText: {
        color: '#1E40AF', // blue-800
        textAlign: 'center',
        fontSize: 14,
    },
    cancelButton: {
        marginTop: 16,
    },
    cancelText: {
        color: '#6B7280', // gray-500
    },
});
