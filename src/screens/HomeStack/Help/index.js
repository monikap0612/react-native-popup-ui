import React from "react";
import { useTheme } from "@react-navigation/native";
import { FlatList, SafeAreaView, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import { StickyHeader } from 'components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { globalStyle, fonts, fontSizes } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';
import HelpUser from '../../../assets/images/help-user.svg';

const routes = [
    {
        label: 'FAQ',
        route: 'FAQ',
        key: 1
    },
    {
        label: 'Contact Us',
        route: 'Contact',
        key: 2
    },
    {
        label: 'About Us',
        route: 'About',
        key: 3
    },
]

const Help = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    return (
        <View style={{ flexGrow: 1, backgroundColor: dark ? '#0E2831' : '#FFF' }}>
            <StickyHeader {...props} headerTitle="Help" />

            <View style={{ flexGrow: 1, paddingBottom: hp(12), marginTop: 8, backgroundColor: dark ? '#0E2831' : '#FFF' }}>
                <View style={[{ backgroundColor: dark ? '#003946' : '#F4F4F4', alignItems: 'center' }]}>
                    <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.title, marginTop: 20, color: dark ? '#FFF' : '#0A0A26' }}>Help Center</Text>
                    <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.big, marginTop: 7, color: dark ? '#FFF' : '#0A0A26' }}>Please get in touch and we will be happy to help you</Text>
                    <HelpUser />
                </View>

                <SafeAreaView style={{ marginTop: hp(6.4) }}>
                    <FlatList
                        data={routes}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return (
                                <TouchableWithoutFeedback onPress={() => { props.navigation.navigate(item.route) }}>
                                    <View style={[globalStyle.rowContainerCenteredSpaced, { paddingVertical: 24, borderColor: 'rgba(255,255,255,0.2)', borderBottomWidth: 1, paddingHorizontal: wp(2) }]}>
                                        <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.big, color: dark ? '#FFF' : '#0A0A26' }]}>{item.label}</Text>
                                        <Feather name='chevron-right' size={24} color={dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} />
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        }}
                    />
                </SafeAreaView>

            </View>
        </View>
    )
}

export default Help;