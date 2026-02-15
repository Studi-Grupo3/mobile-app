import React, { createContext, useContext, useState } from 'react';

const ClassWizardContext = createContext();

export const ClassWizardProvider = ({ children }) => {
    const [wizardData, setWizardData] = useState({
        phase: '', subject: '', duration: '', materials: [],
        model: '', professorId: null, date: null, time: null,
        personalData: {}, address: {}, payment: {}
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateWizardData = (patch) => {
        setWizardData(prev => ({ ...prev, ...patch }));
    };

    const submitAll = async () => {
        setIsSubmitting(true);
        try {
            // Import dynamically to avoid circular deps
            const { appointmentCreateService } = require('../services/appointmentCreateService');
            const response = await appointmentCreateService.create(wizardData);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ClassWizardContext.Provider value={{
            wizardData,
            updateWizardData,
            submitAll,
            isSubmitting
        }}>
            {children}
        </ClassWizardContext.Provider>
    );
};

export const useClassWizard = () => {
    const ctx = useContext(ClassWizardContext);
    if (!ctx) throw new Error('useClassWizard deve ser usado dentro de ClassWizardProvider');
    return ctx;
};
