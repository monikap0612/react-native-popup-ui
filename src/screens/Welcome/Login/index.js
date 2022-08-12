import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Checkbox, StyledText } from 'components';
import VoltpandaDark from '../../../assets/images/voltpanda-dark.svg';
import VoltpandaLight from '../../../assets/images/voltpanda-light.svg';
import Car from '../../../assets/images/green-car.svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import { showHUD, hideHUD } from 'utils/loader';
import { warningPopUp } from "utils/Common";

const Login = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();

    const [isAgree, setIsAgree] = useState(false);

    const [prefix, setPrefix] = useState('+91');
    const [number, setNumber] = useState('');
    // const [number, setNumber] = useState('9173488461');
    // const [number, setNumber] = useState('6290 118 661');

    const onVerifyUser = async () => {
        const reg = /^[0]?[789]\d{9}$/;
        if (reg.test(String(number)) === false) {
            warningPopUp('Please enter valid phone number!!', dark)
        } else {
            // await auth().settings.appVerificationDisabledForTesting = true;
            // await auth().settings?.isAppVerificationDisabledForTesting = true
            showHUD();
            const confirmation = await auth().signInWithPhoneNumber(prefix + number);
            hideHUD();
            props.navigation.navigate('Verify', { prefix: prefix, phone: number, confirmation: confirmation })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: dark ? '#0E2831' : '#FFF', paddingTop: hp(4.5), paddingBottom: hp(1), paddingHorizontal: wp(5) }}>
            <KeyboardAwareScrollView extraHeight={65} enableOnAndroid={true} showsVerticalScrollIndicator={false}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.xBigHeader, color: dark ? colors.GREEN.primary : '#111' }}>Explore the world with</Text>

                    <View style={{ marginTop: hp(2) }}>
                        {
                            dark ?
                                // <VoltpandaLight />
                                <Image source={require('../../../assets/images/voltpanda_dark.png')} style={{ height: hp(5), width: wp(90) }} resizeMode='contain' />

                                :
                                // <VoltpandaDark />
                                <Image source={require('../../../assets/images/voltpanda_light.png')} style={{ height: hp(5), width: wp(90) }} resizeMode='contain' />
                        }
                    </View>

                    {/* <Car style={{ marginTop: hp(4), alignSelf: 'center' }} /> */}
                    <View>
                        <Image source={require('../../../assets/images/login-car.png')} style={{ height: hp(45), width: wp(90) }} resizeMode='contain' />
                    </View>

                    <View style={[{ justifyContent: 'center' }]}>
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <View style={[globalStyle.rowContainer, { borderWidth: 1, borderColor: dark ? colors.GREEN.primary : '#111', borderRadius: 4, height: hp(6.48), backgroundColor: dark ? colors.BLUEGREY.primary : '#FFF', marginTop: hp(2.91) }]}>
                                <View style={[globalStyle.rowContainerCentered, { paddingHorizontal: wp(1.87), borderRightWidth: 1, borderColor: dark ? colors.GREEN.primary : '#111', justifyContent: 'center' }]}>
                                    <Image source={require('../../../assets/images/india-flag.png')} />
                                    <TextInput value={prefix} style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.big }]} />
                                </View>
                                <View style={[{ flex: 1, flexDirection: 'row', paddingRight: wp(3.27), paddingLeft: wp(3.97) }]}>
                                    <TextInput keyboardType="number-pad" value={number} maxLength={10} onChangeText={(val) => setNumber(val)} placeholderTextColor={dark ? '#FFF' : '#0a0a26'} style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.big, flex: 1 }]} placeholder="9873 228 345" />
                                    <View style={[globalStyle.centeredContent, { backgroundColor: dark ? colors.GREEN.primary : colors.GREEN.secondary, alignSelf: 'center', borderRadius: 50, height: 28, width: 28 }]}>
                                        <Feather name='check' size={24} color={'#FFF'} />
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableOpacity activeOpacity={0.7} onPress={() => onVerifyUser()} disabled={isAgree ? false : true}>
                            <View style={{
                                marginTop: hp(3), alignSelf: 'center', width: wp('40%'), paddingVertical: hp(2), justifyContent: 'center', alignItems: 'center', borderRadius: 50,
                                backgroundColor: dark ? colors.BLUEGREY.secondary : colors.GREEN.secondary, opacity: isAgree ? 1 : 0.5
                            }}>
                                <StyledText font='semiBold' size={16} color={'#FFF'}>Send OTP</StyledText>
                            </View>
                        </TouchableOpacity>

                        <StyledText style={{ marginVertical: hp(2.15) }} center font="regular" size={14} color={dark ? '#FFF' : '#0A0A26'}>By continuing you may receive an SMS for verifications. Message and data rates may apply</StyledText>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Checkbox dark={dark} selected={isAgree} onValueChange={(val) => { setIsAgree(val) }} />
                            <StyledText style={{ marginLeft: wp(2) }} font="regular" size={14} color={dark ? '#FFF' : '#0A0A26'}>I Agree to the <Text style={{ textDecorationLine: 'underline' }}>terms</Text> and <Text style={{ textDecorationLine: 'underline' }}>conditions</Text></StyledText>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>

        </View>
    )
}

export default Login;