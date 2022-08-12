import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from 'styleConfig';

const Checkbox = ({ selected, onValueChange, dark = true, ...props }) => {
    return (
        <TouchableOpacity style={{ padding: 8 }} activeOpacity={0.7} onPress={() => { onValueChange(!selected) }}>
            <View style={[styles.container, { borderColor: dark ? '#FFF' : '#0A0A26' }]}>
                <Feather name='check' size={14} color={selected ? colors.GREEN.secondary : 'transparent'} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 3,
        borderWidth: 1.5,
        height: 18,
        width: 18,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Checkbox;