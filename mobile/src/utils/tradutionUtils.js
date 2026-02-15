export const monthNamesPt = {
    JANUARY: 'Janeiro',
    FEBRUARY: 'Fevereiro',
    MARCH: 'Março',
    APRIL: 'Abril',
    MAY: 'Maio',
    JUNE: 'Junho',
    JULY: 'Julho',
    AUGUST: 'Agosto',
    SEPTEMBER: 'Setembro',
    OCTOBER: 'Outubro',
    NOVEMBER: 'Novembro',
    DECEMBER: 'Dezembro',
};

export function translateMonth(monthEn) {
    return monthNamesPt[monthEn.toUpperCase()] || monthEn;
}

export const weekdayNamesPt = {
    SUNDAY: 'Domingo',
    MONDAY: 'Segunda‑feira',
    TUESDAY: 'Terça‑feira',
    WEDNESDAY: 'Quarta‑feira',
    THURSDAY: 'Quinta‑feira',
    FRIDAY: 'Sexta‑feira',
    SATURDAY: 'Sábado',
};

export function translateWeekday(dayEn) {
    return weekdayNamesPt[dayEn.toUpperCase()] || dayEn;
}

export const paymentStatusPt = {
    PENDING: 'Pendente',
    PARTIAL: 'Parcial',
    PAID: 'Pago',
    CANCELLED: 'Cancelado',
};

export function translatePaymentStatus(statusEn) {
    return paymentStatusPt[statusEn.toUpperCase()] || statusEn;
}

export const appointmentStatusPt = {
    SCHEDULED: 'Agendado',
    COMPLETED: 'Concluído',
    CANCELLED: 'Cancelado',
};

export function translateAppointmentStatus(statusEn) {
    return appointmentStatusPt[statusEn.toUpperCase()] || statusEn;
}

export const subjectNamesPt = {
    PORTUGUESE: 'Português',
    MATHEMATICS: 'Matemática',
    GEOGRAPHY: 'Geografia',
    HISTORY: 'História',
    SOCIOLOGY: 'Sociologia',
    PHILOSOPHY: 'Filosofia',
    ART: 'Arte',
    ENGLISH: 'Inglês',
    SPANISH: 'Espanhol',
    SCIENCE: 'Ciências',
    BIOLOGY: 'Biologia',
    CHEMISTRY: 'Química',
    PHYSICS: 'Física',
    LITERACY: 'Alfabetização',
};

export function translateSubject(subjectEn = '') {
    if (!subjectEn || typeof subjectEn !== 'string') return '';
    return subjectNamesPt[subjectEn.toUpperCase()] || subjectEn;
}

export function translateProfessorTitle(titleEn) {
    const parts = titleEn.split(/ de /i);
    if (parts.length !== 2) {
        return titleEn;
    }

    const [prefix, subjEn] = parts;
    const subjPt = translateSubject(subjEn);
    return `${prefix} de ${subjPt}`;
}

export const teacherStatusPt = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
};

export function translateTeacherStatus(statusEn) {
    return teacherStatusPt[statusEn.toUpperCase()] || statusEn;
}
