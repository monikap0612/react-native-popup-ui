import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from 'styleConfig';

const Slider = (props) => {

    const { dark } = useTheme();

    const offsetX = useSharedValue(0);

    const rStyle = useAnimatedStyle(() => {
        return {
            borderRadius: 50,
            transform: [{
                translateX: offsetX.value
            }]
        }
    })

    const handlePress = () => {
        props.onChangeValue != undefined && props.onChangeValue(!props.value);
        offsetX.value = withTiming(props.value ? 0 : (wp(9) - 12));
    }

    return (
        <TouchableWithoutFeedback onPress={() => { handlePress() }}>
            <View style={[styles.slider, {
                backgroundColor: dark ?
                    (props.value ? colors.GREEN.secondary : 'rgba(196, 196, 196, 0.23)')
                    :
                    (props.value ? '#ECECEC' : '#ECECEC')
            }]}>
                <Animated.View style={[rStyle, { height: wp(6), width: wp(6), backgroundColor: dark ? '#FFF' : props.value ? '#19E024' : '#FFF' }]} />
            </View>
        </TouchableWithoutFeedback >
    )
}

const styles = StyleSheet.create({
    slider: {
        borderRadius: 50,
        paddingVertical: 5,
        paddingHorizontal: 6,
        width: wp(15)
    }
})

export default Slider;