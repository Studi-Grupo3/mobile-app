import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';

export function ToggleSwitch({ checked, onChange }) {
    return (
        <View style={styles.container}>
            <Switch
                trackColor={{ false: '#e5e7eb', true: '#3970B7' }}
                thumbColor={'#ffffff'}
                ios_backgroundColor="#e5e7eb"
                onValueChange={onChange}
                value={checked}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
    },
});
