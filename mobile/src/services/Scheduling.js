import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { api } from './provider/api';

const handleSchedule = async ({ selectedDate, selectedTime, navigation }) => {
    if (selectedDate && selectedTime) {
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];

            const professorId = await AsyncStorage.getItem('selectedProfessorId');
            const classModel = await AsyncStorage.getItem('classModel');

            if (!professorId || !classModel) {
                Alert.alert('Atenção', 'Professor ou modelo de aula não selecionados.');
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

            navigation.navigate('AlunoPayment');
        } catch (error) {
            console.error('Erro ao agendar:', error);
            Alert.alert('Erro', 'Erro ao agendar aula. Tente novamente.');
        }
    } else {
        Alert.alert('Atenção', 'Selecione data e horário antes de agendar.');
    }
};

export default handleSchedule;
