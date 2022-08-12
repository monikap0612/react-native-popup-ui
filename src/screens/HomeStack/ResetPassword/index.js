import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, Text, TextInput, View } from "react-native";
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Button } from 'components';

const ResetPassword = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const [email, setEmail] = useState();

    return (
        <View style={{ flex: 1, backgroundColor: dark ? '#0E2831' : '#FFF', paddingTop: hp(4.5), paddingBottom: hp(1), paddingHorizontal: wp(5) }}>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.title }}>Forgot your password?</Text>
                <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.big, marginTop: hp(1.5) }}>Enter your email address to retrieve your password</Text>

                <View style={[globalStyle.rowContainerCentered, { borderRadius: 50, borderWidth: 1, borderColor: colors.GREEN.secondary, paddingHorizontal: 16, marginTop: hp(3), marginBottom: hp(2) }]}>
                    <Image source={require('../../../assets/icons/send-mail.png')} />
                    <TextInput value={email} onChangeText={(val) => { setEmail(val) }} placeholder="Enter your email address or phone number" placeholderTextColor={'#FFF'} style={{ flex: 1, fontFamily: fonts.MULISH.light, fontSize: fontSizes.light, marginLeft: 16 }} />
                </View>

                <Button label='Reset Password' onPress={() => { props.navigation.goBack() }} />

            </View>


            <View style={{ position: 'absolute', bottom: 18, alignItems: 'center', left: 0, right: 0 }}>
                <Image source={require('../../../assets/images/man-thinking.png')} />
            </View>
        </View>
    )
}

export default ResetPassword;