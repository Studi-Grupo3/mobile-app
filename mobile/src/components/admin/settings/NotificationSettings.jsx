import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { SaveButton } from './SaveButton';
import { AlertModal } from '../../ui/AlertModal';
import { useAlert } from '../../../hooks/useAlert';
import { adminSettingsService } from '../../../services/dashboard/adminSettingsService';

const labels = {
    notifyPayments: 'Pagamentos Processados',
    notifyAppointments: 'Novos Agendamentos',
    notifyCancellations: 'Cancelamentos'
};

export function NotificationSettings() {
    const [notif, setNotif] = useState({
        notifyPayments: false,
        notifyAppointments: false,
        notifyCancellations: false
    });
    const { alertConfig, showAlert, hideAlert } = useAlert();

    useEffect(() => {
        adminSettingsService.get()
            .then(data => {
                setNotif({
                    notifyPayments: data.notifyPayments,
                    notifyAppointments: data.notifyAppointments,
                    notifyCancellations: data.notifyCancellations
                });
            })
            .catch(err => console.log('Erro ao carregar notificações:', err));
    }, []);

    const toggle = key =>
        setNotif(prev => ({ ...prev, [key]: !prev[key] }));

    const salvar = async () => {
        try {
            await adminSettingsService.patch(notif);
            showAlert('success', 'Sucesso', 'Notificações salvas com sucesso!');
        } catch (err) {
            console.error('Erro ao salvar notificações:', err);
            showAlert('error', 'Erro', 'Erro ao salvar configurações.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Notificações</Text>
            <Text style={styles.subtitle}>
                Configure quais notificações você deseja receber.
            </Text>

            <View style={styles.listContainer}>
                {Object.entries(notif).map(([key, val]) => (
                    <View key={key} style={styles.row}>
                        <Text style={styles.label}>{labels[key]}</Text>
                        <Switch
                            trackColor={{ false: "#e5e7eb", true: "#3970B7" }}
                            thumbColor={val ? "#ffffff" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => toggle(key)}
                            value={val}
                        />
                    </View>
                ))}
            </View>

            <View style={styles.buttonContainer}>
                <SaveButton onClick={salvar} label="Salvar Alterações" />
            </View>

            <AlertModal visible={alertConfig.visible} type={alertConfig.type} title={alertConfig.title} message={alertConfig.message} onClose={hideAlert} buttons={alertConfig.buttons} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    title: {
        fontSize: 18, // text-lg
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12, // text-xs
        color: '#4B5563', // gray-600
        marginBottom: 24,
    },
    listContainer: {
        gap: 24, // gap-6 (24px)
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 14, // text-sm
        fontWeight: '500',
        color: '#111827', // gray-900
    },
    buttonContainer: {
        marginTop: 32,
        marginBottom: 16,
    },
});
