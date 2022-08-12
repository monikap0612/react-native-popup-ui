import { useTheme } from "@react-navigation/native";
import React from "react";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import { colors, globalStyle, fonts, fontSizes } from 'styleConfig';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBarDots, StyledText } from 'components';
import Map from '../../../../assets/images/map.svg';
import MapLight from '../../../../assets/images/map-light.svg';
import LinearGradient from "react-native-linear-gradient";

const IntroSixth = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: dark ? '#0E2831' : '#FFF' }}>

            <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center' }}>
                {
                    dark ?
                        <Map width={'100%'} />
                        :
                        <MapLight width={'100%'}/>
                }
            </View>

            <View style={[globalStyle.absoluteContainer, { justifyContent: 'flex-end' }]}>
                <LinearGradient locations={[0, 0.5, 0.8]} style={{ height: hp(40), justifyContent: 'flex-end', paddingHorizontal: wp(5), paddingBottom: hp(1) }} colors={dark ? ['rgba(35, 81, 101, 0)', 'rgba(16, 59, 77, 1)'] : ['rgba(255, 255, 255, 0.18)', 'rgba(197, 198, 212, 1)']}>
                    <View style={{ alignItems: 'center' }}>
                        <StyledText style={{ textAlign: 'center', marginBottom: hp(5) }} font={dark ? 'bold' : 'regular'} size={32} color={dark ? '#FFF' : '#0A0A26'}>Find you nearest charging car using the voltpanda app</StyledText>
                        <StatusBarDots length={4} index={0} dark={dark} />
                    </View>
                    <View style={[globalStyle.rowContainerCenteredSpaced, { marginTop: hp(1.83) }]}>
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <Text style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.regular, color: '#FFF' }}>SKIP</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => { props.navigation.navigate('IntroFirst') }}>
                            <Text style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.regular, color: dark ? colors.GREEN.primary : '#111111' }}>NEXT</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </LinearGradient>
            </View>

        </View>
    )
}

export default IntroSixth;