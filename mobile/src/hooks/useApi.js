import { useState, useEffect, useCallback } from "react";

export function useApi(requestFn, deps = [], auto = true) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(auto);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await requestFn();
            setData(response.data);
        } catch (err) {
            const message = err.response?.data?.message || err.message;
            setError(message);
        } finally {
            setLoading(false);
        }
    }, deps);

    useEffect(() => {
        if (auto) fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}
