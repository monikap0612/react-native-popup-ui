import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableWithoutFeedback, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from 'styleConfig';

const DarkModeToggle = ({ value = false, onChangeValue, props }) => {

    const { dark } = useTheme();

    const offsetX = useSharedValue(value ? (wp(9) - 12) : 0);

    const rStyle = useAnimatedStyle(() => {
        return {
            borderRadius: 50,
            transform: [{
                translateX: offsetX.value
            }]
        }
    })

    const handlePress = () => {
        onChangeValue != undefined && onChangeValue(!value);
        offsetX.value = withTiming(!value ? (wp(9) - 12) : 0);
    }

    return (
        <TouchableWithoutFeedback onPress={() => { handlePress() }}>
            <View style={{ borderRadius: 50, backgroundColor: dark ? 'rgba(196, 196, 196, 0.23)' : '#FFF', paddingVertical: 5, paddingHorizontal: 6, width: wp(15) }}>
                <Animated.View style={[rStyle, { height: wp(6), width: wp(6), backgroundColor: colors.GREEN.secondary }]} />
            </View>
        </TouchableWithoutFeedback>
    )
}

export default DarkModeToggle;