import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, TextInput } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import UserService from "networkServices/UserService";
import { showHUD, hideHUD } from 'utils/loader';
import { useSelector, useDispatch } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { Button } from 'components';
import Toast from 'react-native-simple-toast';

import { get, map } from "lodash";

import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';

const WriteUs = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const dispatch = useDispatch();
    const { loginInfo, userInfo, deviceFCMToken } = useSelector((state) => state.auth);

    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
    }, [])

    async function onContactUs() {

        const contactUsPayload = [
            { name: "Subject", data: subject },
            { name: "Message", data: message },
        ]
        const isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const contactUsData = await UserService.contactUs(loginInfo, contactUsPayload);
            hideHUD();
            if (isGetSuccessData(contactUsData)) {
                Toast.show('Feedback Save Successfully');
                setSubject('');
                setMessage('');
                props.navigation.goBack();
            }
            else {
                apiFallBackAlert(contactUsData, dark)
            }
        }
        else {
            showInternetLostAlert(() => {
                onContactUs();
            });
        }
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(12) }} style={{ backgroundColor: dark ? '#0E2831' : '#FFF' }}>
            <View style={[globalStyle.centeredContent, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', paddingVertical: 16 }]}>
                <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.header, color: dark ? '#fff' : '#000' }}>Write Us</Text>
                <TouchableWithoutFeedback onPress={() => { props.navigation.goBack() }}>
                    <Feather style={{ position: 'absolute', left: 18, color: dark ? '#fff' : '#000' }} name='chevron-left' size={24} />
                </TouchableWithoutFeedback>
            </View>
            <View style={{ padding: hp(2) }}>
                <View style={[globalStyle.rowContainer, { backgroundColor: dark ? undefined : '#EFEFEF', borderRadius: 10, borderWidth: 1, borderColor: colors.GREEN.secondary, overflow: 'hidden', height: hp(10.4), marginTop: hp(3) }]}>
                    <View style={[{ flex: 1, padding: 10 }]}>
                        <TextInput multiline value={subject} placeholder="Enter Subject" placeholderTextColor={dark ? 'rgba(255,255,255,0.4)' : 'rgba(10, 10, 38,0.4)'} style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.big, color: dark ? "#fff" : "#000" }}
                            onChangeText={(text) => setSubject(text)} />
                    </View>
                </View>
                <View style={[globalStyle.rowContainer, { backgroundColor: dark ? undefined : '#EFEFEF', borderRadius: 10, borderWidth: 1, borderColor: colors.GREEN.secondary, overflow: 'hidden', height: hp(10.4), marginTop: hp(3) }]}>
                    <View style={[{ flex: 1, padding: 10 }]}>
                        <TextInput multiline value={message} placeholder="Enter Message" placeholderTextColor={dark ? 'rgba(255,255,255,0.4)' : 'rgba(10, 10, 38,0.4)'} style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.big, color: dark ? "#fff" : "#000" }}
                            onChangeText={(text) => setMessage(text)} />
                    </View>
                </View>
                <View style={{ marginTop: hp(5) }}>
                    <Button label='Send Mail' onPress={() => onContactUs()} />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16
    },
    body: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 16,
    }
})


export default WriteUs;