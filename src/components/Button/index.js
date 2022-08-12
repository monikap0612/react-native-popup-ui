import React from "react";
import { Dimensions, Text, TouchableWithoutFeedback, View } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';

const { height, width } = Dimensions.get('screen');

const Button = (props) => {
    return (
        <TouchableWithoutFeedback onPress={() => { props.onPress != undefined && props.onPress() }}>
            <View style={[globalStyle.centeredContent, { borderRadius: 90, backgroundColor: colors.GREEN.secondary, height: heightPercentageToDP(5.4), width: '100%', padding: 5 }, props.style]}>
                <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.semiExtraBig, textAlign: 'center', color: '#FFF' }]}>{props.label}</Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default Button;