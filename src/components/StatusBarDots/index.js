import React from "react";
import { View } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { colors, globalStyle } from 'styleConfig';

const StatusBarDots = (props) => {
    return (
        <View style={[globalStyle.rowContainer, {}]}>
            {
                [...Array(props.length).keys()].map((element) => {
                    return (
                        <View key={element} style={{ borderRadius: 50, backgroundColor: props.index == element ? colors.GREEN.primary : props.dark ? '#FFFFFF' : '#FFF', height: widthPercentageToDP(4.2), width: widthPercentageToDP(4.2), marginRight: 11 }} />
                    )
                })
            }
        </View>
    )
}

export default StatusBarDots;