import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './provider/api';
import { showAlert } from '../components/common/ShowAlert';

const handleSchedule = async ({ selectedDate, selectedTime, navigation }) => {
    if (selectedDate && selectedTime) {
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];

            const professorId = await AsyncStorage.getItem('selectedProfessorId');
            const classModel = await AsyncStorage.getItem('classModel');

            if (!professorId || !classModel) {
                showAlert({ title: 'Atenção', text: 'Professor ou modelo de aula não selecionados.', icon: 'error' });
                return;
            }

            const appointmentDTO = {
                idStudent: null,
                idTeacher: Number(professorId),
                dateTime: selectedDate.toISOString(),
                lessonDuration: null,
                location: null,
                totalValue: null,
                status: 'scheduled',
            };

            const response = await api.post('/appointments', appointmentDTO);
            console.log('Agendamento realizado:', response.data);

            await AsyncStorage.removeMany(['selectedProfessorId', 'classModel']);

            navigation.navigate('ConfirmedPayment', { appointmentId: response.data?.id });
        } catch (error) {
            console.error('Erro ao agendar:', error);
            showAlert({ title: 'Erro', text: 'Erro ao agendar aula. Tente novamente.', icon: 'error' });
        }
    } else {
        showAlert({ title: 'Atenção', text: 'Selecione data e horário antes de agendar.', icon: 'error' });
    }
};

export default handleSchedule;
