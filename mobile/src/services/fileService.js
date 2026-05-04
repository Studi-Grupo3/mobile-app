import { api } from './provider/api';

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
};
