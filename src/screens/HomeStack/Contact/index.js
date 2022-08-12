import React from "react";
import { useTheme } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, Linking, Platform } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import { warningPopUp } from 'utils/Common';

const Contact = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();

    function onOpenEmail() {
        try {
            Linking.openURL('mailto:info@voltpanda.com')
            .catch(warningPopUp('Sorry, can not open mail', dark))
        }
        catch (err) {
            warningPopUp('Sorry, can not open mail', dark)
        }
        // Linking.canOpenURL('mailto:info@voltpanda.com')
        //     .then(supported => {
        //         if (!supported) {
        //             alert('Sorry, can not open url')
        //         } else {
        //             return Linking.openURL('mailto:info@voltpanda.com')
        //                 .catch()
        //         }
        //     })
        //     .catch(alert('Sorry, can not open mail'))
    }

    function onOpenPhone() {

        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = `tel:+91 1234 567 890`;
        } else {
            phoneNumber = `telprompt:+91 1234 567 890`;
        }
        try {
            Linking.openURL(phoneNumber)
            .catch(warningPopUp('Sorry, can not open phone', dark))
        }
        catch (err) {
            warningPopUp('Sorry, can not open phone', dark)
        }
        // Linking.canOpenURL(`tel:+91 1234 567 890`)
        // .then(supported => {
        //     if (!supported) {
        //         alert('Sorry, can not open url')
        //     } else {
        //         return Linking.openURL(`tel:+91 1234 567 890`)
        //             .catch()
        //     }
        // })
        // .catch(alert('Sorry, can not open phone'))
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(12) }} style={{ backgroundColor: dark ? '#0E2831' : '#FFF' }}>
            <View style={[globalStyle.centeredContent, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', paddingVertical: 16 }]}>
                <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.header, color: dark ? '#fff' : '#000' }}>Contact Us</Text>
                <TouchableWithoutFeedback onPress={() => { props.navigation.pop() }}>
                    <Feather style={{ position: 'absolute', left: 18, color: dark ? '#fff' : '#000' }} name='chevron-left' size={24} />
                </TouchableWithoutFeedback>
            </View>

            <View style={{ flex: 1, paddingHorizontal: wp(5), paddingTop: hp(5) }}>
                <TouchableWithoutFeedback onPress={() => onOpenEmail()}>
                    <View style={[styles.container, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF', elevation: dark ? 0 : 4 }]}>
                        <View style={{ alignItems: 'flex-start', height: '55%' }}>
                            <Feather name='mail' size={24} style={{ color: dark ? '#fff' : '#000' }} />
                        </View>
                        <View style={{ paddingLeft: 12 }}>
                            <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.extraBig, color: dark ? '#fff' : '#000' }}>Send us an email</Text>
                            <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.big, color: colors.GREEN.secondary }}>info@voltpanda.com</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => onOpenPhone()}>
                    <View style={[styles.container, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF', elevation: dark ? 0 : 4 }]}>
                        <View style={{ alignItems: 'flex-start', height: '55%' }}>
                            <Feather name='phone' size={24} style={{ color: dark ? '#fff' : '#000' }} />
                        </View>
                        <View style={{ paddingLeft: 12 }}>
                            <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.extraBig, color: dark ? '#fff' : '#000' }}>Call us</Text>
                            <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.big, color: colors.GREEN.secondary }}>+91 1234 567 890</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { props.navigation.navigate('ReportIssue') }}>
                    <View style={[styles.container, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF', elevation: dark ? 0 : 4 }]}>
                        <Feather name='zap' size={24} style={{ color: dark ? '#fff' : '#000' }} />
                        <View style={{ paddingLeft: 12 }}>
                            <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.extraBig, color: dark ? '#fff' : '#000' }}>Charging point issue</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { props.navigation.navigate('WriteUs') }}>
                    <View style={[styles.container, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF', elevation: dark ? 0 : 4 }]}>
                        <Feather name='edit' size={24} style={{ color: dark ? '#fff' : '#000' }} />
                        <View style={{ paddingLeft: 12 }}>
                            <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.extraBig, color: dark ? '#fff' : '#000' }}>Write to us</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6,
        paddingLeft: 24,
        marginBottom: 12,
        height: hp(9.7)
    }
})

export default Contact;