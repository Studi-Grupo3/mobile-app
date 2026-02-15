import { api } from './provider/api';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const fileService = {
    upload: (fileUri, fileName) => {
        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            name: fileName || 'upload',
            type: 'application/octet-stream',
        });
        return api.post('/files', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(res => res.data);
    },

    getInfo: (id) => api.get(`/files/${id}/info`).then(res => res.data),

    download: async (id) => {
        const response = await api.get(`/files/${id}`, { responseType: 'arraybuffer' });
        const cd = response.headers['content-disposition'];
        const match = cd && cd.match(/filename="(.+)"/);
        const fileName = (match && match[1]) || 'downloaded-file';

        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, response.data, {
            encoding: FileSystem.EncodingType.Base64,
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        }
    },
};
