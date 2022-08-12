import { useTheme } from "@react-navigation/native";
import React, { useState, useRef, useEffect } from "react";
import { Image, ImageBackground, Text, TouchableWithoutFeedback, View } from "react-native";
import { colors, globalStyle, fonts, fontSizes } from 'styleConfig';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import IntroFirst from "../IntroFirst";
import IntroSecond from "../IntroSecond";
import IntroThird from "../IntroThird";
import IntroFourth from "../IntroFourth";
import { StatusBarDots, StyledText } from 'components';
import { widthPercentageToDP } from "react-native-responsive-screen";
import localStorage from "utils/LocalStorage";
import ViewPager from '@react-native-community/viewpager';
import Dots from 'react-native-dots-pagination';

let Data = [
    {
        screen: <IntroFirst />
    },
    {
        screen: <IntroSecond />
    },
    {
        screen: <IntroThird />
    },
    {
        screen: <IntroFourth />
    }
]

const InitialIntro = (props) => {

    const { dark } = useTheme();
    const [activeIndex, setActiveIndex] = useState(0)
    let viewPagerRef = useRef(null);

    useEffect(() => {
        saveLoginInfo()
    }, [])

    const saveLoginInfo = async () => {
        await localStorage.saveKey('isLoginScreen', 'true');

    }

    const renderPageViewer = () => {
        return Data.map((item, index) => {
            return (

                <View style={{ flex: 1 }} key={index.toString()}>

                    {item.screen}

                </View>

            )
        })
    }

    const renderDotIndicator = () => {
        return <PagerDotIndicator pageCount={4}
            selectedDotStyle={{ borderRadius: 50, backgroundColor: colors.GREEN.primary, height: widthPercentageToDP(4.2), width: widthPercentageToDP(4.2), marginRight: 11, bottom: activeIndex == 3 ? hp(8) : hp(3) }}
            dotStyle={{ borderRadius: 50, backgroundColor: '#FFFF', height: widthPercentageToDP(4.2), width: widthPercentageToDP(4.2), marginRight: 11, bottom: activeIndex == 3 ? hp(8) : hp(3) }}
        />;
    }

    const onNextPress = () => {
        viewPagerRef.current?.setPage(activeIndex + 1);
    }

    return (
        <View style={{ flex: 1 }}>

            <ViewPager
                style={{ flex: 1, }}
                // indicator={renderDotIndicator()}
                ref={viewPagerRef}
                initialPage={0}
                onPageScroll={(e) => {
                    if (e.nativeEvent.position !== activeIndex)
                        setActiveIndex(e.nativeEvent.position)
                }}
            >
                {renderPageViewer()}

            </ViewPager>
            <View style={{ position: 'absolute', bottom: activeIndex == 3 ? hp(8) : hp(3), alignSelf: "center" }}>
                <Dots
                    length = {4}
                    active = {activeIndex}
                    passiveColor = {"#fff"}
                    activeColor = {colors.GREEN.primary}
                    passiveDotHeight = {widthPercentageToDP(4.2)}
                    activeDotHeight = {widthPercentageToDP(4.2)}
                    passiveDotWidth = {widthPercentageToDP(4.2)}
                    activeDotWidth = {widthPercentageToDP(4.2)}
                    marginHorizontal = {5}
                    />
            </View>
            {
                activeIndex != 3 ?
                    <View style={[globalStyle.rowContainerCenteredSpaced, { position: "absolute", bottom: 0, width: '100%', padding: 15 }]}>
                        <TouchableWithoutFeedback onPress={() => { props.navigation.navigate('Login') }}>
                            <Text style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.big, color: '#FFF' }}>SKIP</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => onNextPress()}>
                            <Text style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.big, color: dark ? colors.GREEN.primary : '#111111' }}>NEXT</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    :
                    <View style={{ position: "absolute", bottom: hp(2), width: '100%' }}>
                        <TouchableWithoutFeedback onPress={() => { props.navigation.navigate('Login') }}>
                            <View style={{ borderRadius: 20, backgroundColor: dark ? colors.GREEN.secondary : '#FFF', justifyContent: 'center', alignItems: 'center', paddingVertical: hp(1), width: '40%', alignSelf: 'center', marginTop: hp(4) }}>
                                <StyledText font="semiBold" size={18} color={dark ? '#FFF' : '#0A0A26'}>Let's Go!</StyledText>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
            }
        </View>
    )
}

export default InitialIntro;