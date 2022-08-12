import React from "react";
import { Image, TextInput, View } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';

const Textbox = (props) => {
    return (
        <View style={[globalStyle.rowContainer, { borderRadius: 50, height: 50, borderWidth: 1, borderColor: props.borderColor != undefined ? props.borderColor : colors.GREEN.secondary, marginBottom: heightPercentageToDP(5) }]}>
            <View style={[globalStyle.centeredContent, { borderRightWidth: 1, borderColor: props.borderColor != undefined ? props.borderColor : colors.GREEN.secondary, width: '20%' }]}>
                <Image source={props.image} />
            </View>
            <View style={[{ flex: 1, paddingLeft: widthPercentageToDP(4.2), justifyContent: 'center' }]}>
                <TextInput value={props.value} onChangeText={props.onChange} autoCapitalize={'none'} placeholder={props.placeholder} placeholderTextColor={props.placeholderTextColor != undefined ? props.placeholderTextColor : '#FFF'} style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.light }, props.style]} />
            </View>
        </View>
    )
}

export default Textbox;