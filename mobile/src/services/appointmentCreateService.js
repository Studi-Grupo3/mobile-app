import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './provider/api';
import { toISOStringDateTime, parseDurationToMinutes } from '../utils/date';

const subjectToEnum = {
    'Português': 'PORTUGUESE',
    'Matemática': 'MATHEMATICS',
    'Geografia': 'GEOGRAPHY',
    'História': 'HISTORY',
    'Sociologia': 'SOCIOLOGY',
    'Filosofia': 'PHILOSOPHY',
    'Arte': 'ART',
    'Inglês': 'ENGLISH',
    'Espanhol': 'SPANISH',
    'Ciências': 'SCIENCE',
    'Biologia': 'BIOLOGY',
    'Química': 'CHEMISTRY',
    'Física': 'PHYSICS',
    'Alfabetização': 'LITERACY',
    'Literatura': 'PORTUGUESE',
};

async function getStudentIdFromSession() {
    const idStr = await AsyncStorage.getItem('userId');
    if (!idStr) {
        console.error('appointmentCreateService: userId não encontrado em AsyncStorage');
        return null;
    }
    const id = Number(idStr);
    if (isNaN(id)) {
        console.error('appointmentCreateService: userId em AsyncStorage não é um número válido:', idStr);
        return null;
    }
    return id;
}

export const appointmentCreateService = {
    create: async (data) => {
        const payload = {};

        payload.idStudent = data.idStudent ?? await getStudentIdFromSession();
        payload.idTeacher = data.professorId;

        if (data.date && data.time) {
            payload.dateTime = toISOStringDateTime(data.date, data.time);
        }

        if (data.duration) {
            payload.lessonDuration = parseDurationToMinutes(data.duration);
        }

        if (data.location) {
            payload.location = data.location === 'home' ? 'Presencial' : 'Online';
        }

        if (data.location === 'home' && data.endereco) {
            payload.endereco = {
                rua: data.endereco.rua || '',
                cidade: data.endereco.cidade || '',
                estado: data.endereco.estado || '',
                cep: data.endereco.cep || '',
                numero: data.endereco.numero || '',
                complemento: data.endereco.complemento || ''
            };
        }

        if (data.phase) payload.phase = data.phase;
        if (data.subject) payload.subject = subjectToEnum[data.subject] || data.subject;
        if (Array.isArray(data.materials))
            payload.materials = data.materials.map(m => m.name);
        if (data.personal) payload.personalData = data.personal;

        payload.paymentStatus = 'PAID';
        payload.totalValue = data.pagamento?.totalValue ?? 0;
        payload.status = 'SCHEDULED';

        console.log('Payload JSON:', JSON.stringify(payload, null, 2));
        const response = await api.post('/appointments', payload);
        return response.data;
    },
};
