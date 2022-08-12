import React from "react";
import { useTheme } from "@react-navigation/native";
import { ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import aboutStrings from "data/about";
import { useSelector, useDispatch } from 'react-redux';
import { get } from "lodash";

const About = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const { homeDetails } = useSelector((state) => state.home);

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(12) }} style={{ backgroundColor: dark ? '#0E2831' : '#FFF' }}>
            <View style={[globalStyle.centeredContent, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', paddingVertical: 16 }]}>
                <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.header }}>About Us</Text>
                <TouchableWithoutFeedback onPress={() => { props.navigation.pop() }}>
                    <Feather style={{ position: 'absolute', left: 18 }} name='chevron-left' size={24} />
                </TouchableWithoutFeedback>
            </View>

            <View style={{ flex: 1, paddingTop: hp(4), paddingHorizontal: wp(5) }}>
                <Text style={{ marginBottom: 20, fontFamily: fonts.MULISH.light, fontSize: fontSizes.big }}>{get(homeDetails, 'otherDetails.aboutUs', '-')}</Text>
                {/* {
                    aboutStrings.map(text => {
                        return (
                            <Text style={{ marginBottom: 20, fontFamily: fonts.MULISH.light, fontSize: fontSizes.big }}>{get(homeDetails, 'otherDetails.aboutUs', '-')}</Text>
                        )
                    })
                } */}
            </View>

        </ScrollView>
    )
}

export default About;