import { useWindowDimensions } from 'react-native';

export const useIsMobile = () => {
    const { width } = useWindowDimensions();
    return width <= 768;
};
