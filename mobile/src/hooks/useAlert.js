import { useState, useCallback } from 'react';

export function useAlert() {
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        type: 'info',
        title: '',
        message: '',
        buttons: null,
    });

    const showAlert = useCallback((type, title, message, buttons) => {
        setAlertConfig({ visible: true, type, title, message, buttons: buttons || null });
    }, []);

    const hideAlert = useCallback(() => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    }, []);

    return { alertConfig, showAlert, hideAlert };
}
