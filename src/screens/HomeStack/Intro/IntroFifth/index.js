import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { colors, globalStyle, fonts, fontSizes } from 'styleConfig';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import VoltpandaDark from '../../../../assets/images/voltpanda-dark.svg';
import VoltpandaLight from '../../../../assets/images/voltpanda-light.svg';
import GreenCar from '../../../../assets/images/green-car.svg';
import GestureRecognizer from "react-native-swipe-gestures";

const IntroFifth = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();

    const [prefix, setPrefix] = useState('+91')
    const [number, setNumber] = useState('9873 228 345')

    const handleSwipeLeft = () => {
        props.navigation.navigate('ResetPassword')
    }

    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };

    return (
        <GestureRecognizer
            style={{ flex: 1 }}
            config={config}
            onSwipeLeft={() => { handleSwipeLeft() }}
        >
            <View style={{ flex: 1, backgroundColor: dark ? '#0E2831' : '#FFF', paddingTop: hp(4.5), paddingBottom: hp(1), paddingHorizontal: wp(5) }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.xBigHeader, color: colors.GREEN.primary }}>Explore the world with</Text>
                    <View style={{ marginTop: hp(2) }}>
                        {
                            dark ?
                                <VoltpandaLight />
                                :
                                <VoltpandaDark />
                        }
                    </View>
                    <GreenCar style={{ marginTop: hp(3) }} />
                </View>

                <View style={[{ justifyContent: 'center' }]}>
                    <TouchableWithoutFeedback onPress={() => { props.navigation.navigate('Verify') }}>
                        <View style={[globalStyle.rowContainer, { borderWidth: 1, borderColor: colors.GREEN.primary, borderRadius: 4, height: hp(6.48), backgroundColor: colors.BLUEGREY.primary, marginTop: hp(2.91) }]}>
                            <View style={[globalStyle.rowContainerCentered, { paddingHorizontal: wp(1.87), borderRightWidth: 1, borderColor: colors.GREEN.primary, justifyContent: 'center' }]}>
                                <Image source={require('../../../../assets/images/india-flag.png')} />
                                <TextInput value={prefix} style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.big }]} />
                            </View>
                            <View style={[globalStyle.rowContainerCenteredSpaced, { flex: 1, paddingRight: wp(3.27), paddingLeft: wp(3.97) }]}>
                                <TextInput value={number} style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.big }]} />
                                <View style={[globalStyle.centeredContent, { backgroundColor: colors.GREEN.primary, borderRadius: 50, height: 28, width: 28 }]}>
                                    <Feather name='check' size={24} color={'#FFF'} />
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={[globalStyle.rowContainerCenteredSpaced, { marginTop: hp(5.07) }]}>
                        <View style={[globalStyle.rowContainer, { flex: 1, borderWidth: 1, borderColor: colors.GREEN.primary, borderRadius: 4, height: hp(6.48), backgroundColor: colors.BLUEGREY.primary, alignItems: 'center', paddingLeft: wp(2.57), marginRight: wp(2.5) }]}>
                            <Image style={{ height: 34, width: 34 }} source={require('../../../../assets/images/google.png')} />
                            <Text style={[{ fontFamily: fonts.MULISH.semiBold, fontSize: fontSizes.header, marginLeft: wp(3) }]}>Google</Text>
                        </View>
                        <View style={[globalStyle.rowContainer, { flex: 1, borderWidth: 1, borderColor: colors.GREEN.primary, borderRadius: 4, height: hp(6.48), backgroundColor: colors.BLUEGREY.primary, alignItems: 'center', paddingLeft: wp(2.57), marginLeft: wp(2.5) }]}>
                            <Image style={{ height: 34, width: 34 }} source={require('../../../../assets/images/facebook.png')} />
                            <Text style={[{ fontFamily: fonts.MULISH.semiBold, fontSize: fontSizes.header, marginLeft: wp(3) }]}>Facebook</Text>
                        </View>
                    </View>


                    <Text style={[{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.regular, textAlign: 'center', marginTop: hp(2.15) }]}>By continuing you may receive an SMS for verifications. Message and data rates may apply</Text>
                    <TouchableWithoutFeedback onPress={() => { props.navigation.navigate('ResetPassword') }}>
                        <Text style={[{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.regular, textAlign: 'center', marginTop: hp(3) }]}>Not a Member Yet? Please</Text>
                    </TouchableWithoutFeedback>
                </View>

            </View>
        </GestureRecognizer>
    )
}

export default IntroFifth;