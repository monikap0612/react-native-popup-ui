import { useTheme } from "@react-navigation/native";
import React from "react";
import { ImageBackground, Text, TouchableWithoutFeedback, View, Image } from "react-native";
import { colors, globalStyle, fonts, fontSizes } from 'styleConfig';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBarDots } from 'components';
import VoltpandaDark from '../../../../assets/images/voltpanda-dark.svg';
import VoltpandaLight from '../../../../assets/images/voltpanda-light.svg';
import Taxi from '../../../../assets/images/taxi.svg';
import LogoDark from '../../../../assets/images/logo-dark.svg';
import LogoLight from '../../../../assets/images/logo-light.svg';
import GestureRecognizer from 'react-native-swipe-gestures';

const IntroSecond = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();

    const getBackgroundImage = () => {
        return dark ? require('../../../../assets/images/bluegrey-background.png')
            : require('../../../../assets/images/green-background.png');
    }

    const handleSwipeLeft = () => {
        // props.navigation.navigate('IntroThird')
    }

    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };

    return (
        <GestureRecognizer
            config={config}
            style={{ flex: 1 }}
            onSwipeLeft={() => { handleSwipeLeft() }}
        >
            <View style={{ flex: 1, backgroundColor: dark ? '#0E2831' : '#FFF', paddingTop: hp(4.5), paddingBottom: hp(1), paddingHorizontal: wp(5) }}>
                <View style={{ alignItems: 'center' }}>
                    {
                        dark ?
                            // <LogoLight />
                            <Image source={require('../../../../assets/images/logo-dark.png')} style={{ height: hp(7), width: wp(100) }} resizeMode='contain' />
                            :
                            // <LogoDark />
                            <Image source={require('../../../../assets/images/logo-light.png')} style={{ height: hp(7), width: wp(100) }} resizeMode='contain' />
                    }
                    <View style={{ marginTop: hp(2) }}>
                        {
                            dark ?
                                // <VoltpandaLight />
                                <Image source={require('../../../../assets/images/voltpanda_dark.png')} style={{ height: hp(5), width: wp(90) }} resizeMode='contain' />

                                :
                                // <VoltpandaDark />
                                <Image source={require('../../../../assets/images/voltpanda_light.png')} style={{ height: hp(5), width: wp(90) }} resizeMode='contain' />
                        }
                    </View>

                    <View style={{ marginTop: hp(3) }}>
                        <Image source={require('../../../../assets/images/Intro2.png')} style={{ height: hp(50), width: wp(100) }} resizeMode='contain' />
                    </View>

                    {/* <Taxi style={{ marginTop: hp(3) }} /> */}
                </View>

                <View style={[globalStyle.absoluteContainer, { justifyContent: 'flex-end' }]}>
                    <ImageBackground style={{ height: hp(29), justifyContent: 'flex-end', paddingHorizontal: wp(2), paddingBottom: hp(1) }} resizeMode="stretch" source={getBackgroundImage()}>
                        <View style={{ alignItems: 'center', bottom: hp(8) }}>
                            <Text style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.title, textAlign: 'center', color: dark ? '#FFF' : '#111111' }}>Find charging stations</Text>
                            <Text style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.regular, textAlign: 'center', marginTop: hp(1.08), marginBottom: hp(2), color: dark ? '#FFF' : '#111111' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et aliqua.</Text>
                            {/* <StatusBarDots length={4} index={1} dark={dark} /> */}
                        </View>
                    </ImageBackground>
                </View>

            </View>
        </GestureRecognizer>
    )
}

export default IntroSecond;