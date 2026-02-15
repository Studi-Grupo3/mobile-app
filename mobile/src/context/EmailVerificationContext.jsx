import { createContext, useContext, useState } from "react";

const EmailVerificationContext = createContext();

export const EmailVerificationProvider = ({ children }) => {
    const [loading, setLoading] = useState({
        sendCode: false,
        verifyCode: false,
        resetPassword: false,
    });

    const value = {
        loading,
        setLoading,
    };

    return (
        <EmailVerificationContext.Provider value={value}>
            {children}
        </EmailVerificationContext.Provider>
    );
};

export const useEmailVerificationContext = () => {
    return useContext(EmailVerificationContext);
};
