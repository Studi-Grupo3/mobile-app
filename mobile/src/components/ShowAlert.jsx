import Toast from 'react-native-toast-message';

export const showAlert = ({ title, text, icon }) => {
    // Map icons to Toast types
    let type = 'info';
    if (icon === 'success') type = 'success';
    if (icon === 'error') type = 'error';

    Toast.show({
        type: type,
        text1: title,
        text2: text,
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
    });
};
