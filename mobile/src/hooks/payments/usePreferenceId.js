import { useState, useEffect } from 'react';
import { preferenceService } from '../../services/preferenceService';

export function usePreferenceId(amount, payerEmail) {
    const [preferenceId, setPreferenceId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPreference() {
            try {
                // If amount is not set or 0, return early or handle
                if (!amount) {
                    setLoading(false);
                    return;
                }
                const response = await preferenceService.createPreference(amount, payerEmail);
                setPreferenceId(response.preferenceId);
            } catch (err) {
                console.error("Error creating preference:", err);
                setError(err.message || 'Erro ao criar preferência de pagamento');
            } finally {
                setLoading(false);
            }
        }

        fetchPreference();
    }, [amount, payerEmail]);

    return { preferenceId, loading, error };
}
