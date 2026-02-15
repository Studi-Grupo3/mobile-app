import { useEffect, useState } from "react";
import { api } from "../services/provider/api";

export function useUserName(userId, role) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId || !role) {
            setName("");
            setLoading(false);
            return;
        }

        setLoading(true);

        const fetchName = async () => {
            try {
                let response;
                if (role === "STUDENT") {
                    response = await api.get(`/students/${userId}`);
                    setName(response.data.name);
                } else if (role === "TEACHER") {
                    response = await api.get(`/teachers/${userId}`);
                    setName(response.data.name);
                } else {
                    setName("");
                }
            } catch {
                setName("");
            } finally {
                setLoading(false);
            }
        };

        fetchName();
    }, [userId, role]);

    return { name, loading };
}
