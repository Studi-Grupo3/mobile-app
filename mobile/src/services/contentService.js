import { api } from './provider/api';

export const contentService = {
    uploadFileWithStudentId: async (fileUri, fileName, studentId) => {
        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            name: fileName || 'upload',
            type: 'application/octet-stream',
        });
        formData.append('studentId', String(studentId));

        const response = await api.post('/files', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    },

    createClass: async (data) => {
        const formData = new FormData();
        formData.append('file', {
            uri: data.fileUri,
            name: data.fileName || 'upload',
            type: 'application/octet-stream',
        });
        formData.append('idStudent', String(data.idStudent));

        const response = await api.post('/files', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    }
};
