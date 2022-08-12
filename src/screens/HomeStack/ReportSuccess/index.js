import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, Image, View, StyleSheet, Dimensions } from "react-native";
import { colors, globalStyle } from 'styleConfig';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyledText, Button } from 'components';
import Feather from 'react-native-vector-icons/Feather';
import { showHUD, hideHUD } from 'utils/loader';
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';
import UserService from "networkServices/UserService";
import Toast from 'react-native-simple-toast';
import { useSelector, useDispatch } from 'react-redux';

const { height, width } = Dimensions.get('screen');

const ReportSuccess = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const { loginInfo, userInfo, deviceFCMToken } = useSelector((state) => state.auth);

    useEffect(() => {
        onReportIssue()
    },[])

    const onReportIssue = async () => {
        const { message, subject } = props.route.params;
        const issuePayload = [
            { name: "Subject", data: subject },
            { name: "Message", data: message },
        ]

        const isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const reportedData = await UserService.contactUs(loginInfo, issuePayload);
            hideHUD();
            if (isGetSuccessData(reportedData)) {
                Toast.show('Feedback Save Successfully');
            }
            else {
                apiFallBackAlert(reportedData, dark)
            }
        }
        else {
            showInternetLostAlert(() => {
                onReportIssue();
            });
        }
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(3), paddingHorizontal: wp(3), }} style={{ backgroundColor: dark ? '#0E2831' : '#FFF' }}>

            <View style={{ alignItems: 'center', marginTop: hp(3) }}>
                <StyledText size={32} font='light' style={{ textAlign: 'center' }} color={dark ? '#FFF' : '#0A0A26'}>Report an issue</StyledText>
                <View style={[globalStyle.centeredContent, { borderRadius: 150, backgroundColor: colors.GREEN.secondary, width: width * 0.5, height: width * 0.5, marginTop: hp(3) }]}>
                    <Feather name='check' size={width * 0.35} color={'#FFF'} />
                </View>

                <StyledText size={24} font='bold' style={{ textAlign: 'center', marginTop: hp(3) }} color={dark ? '#FFF' : '#0A0A26'}>Thank you for reporting the issue.</StyledText>

                <StyledText size={16} font='light' style={{ textAlign: 'center', marginTop: hp(3), lineHeight: 32 }} color={dark ? '#FFF' : '#0A0A26'}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sollicitudin risus et elit venenatis convallis. Etiam non fermentum turpis.</StyledText>

                <View style={[globalStyle.rowContainerCenteredSpaced, { marginTop: hp(3) }]}>
                    <View style={[styles.contactContainer, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF', borderColor: dark ? undefined : '#E0E0E0' }]}>
                        <Image style={{ height: '32%', width: '70%', marginBottom: hp(4) }} resizeMode='cover' source={dark ? require('../../../assets/icons/mail.png') : require('../../../assets/icons/mail-green.png')} />
                        <StyledText font='light' size={16} style={{ position: 'absolute', bottom: 24 }} color={dark ? '#FFF' : '#0A0A26'}>Email Us</StyledText>
                    </View>
                    <View style={[styles.contactContainer, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF', borderColor: dark ? undefined : '#E0E0E0' }]}>
                        <Image style={{ height: '49%', width: '49%', marginBottom: hp(4) }} resizeMode='cover' source={dark ? require('../../../assets/icons/phone.png') : require('../../../assets/icons/phone-green.png')} />
                        <StyledText font='light' size={16} style={{ position: 'absolute', bottom: 24 }} color={dark ? '#FFF' : '#0A0A26'}>Call Us</StyledText>
                    </View>
                </View>
            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Button label='Back to home screen' onPress={() => { props.navigation.navigate('Home') }} />
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    greenCircle: {
        borderRadius: 50,
        backgroundColor: colors.GREEN.secondary,
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: colors.BLUEGREY.secondary,
        width: wp(31),
        height: wp(31),
        marginHorizontal: wp(5),
        borderWidth: 1,
        borderColor: undefined
    }
})

export default ReportSuccess;