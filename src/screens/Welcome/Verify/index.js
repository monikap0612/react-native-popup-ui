import React, { useEffect, useState, useRef } from "react";
import { Text, TouchableWithoutFeedback, View, SafeAreaView, ToastAndroid, StyleSheet, Platform, Keyboard, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, fonts, fontSizes } from 'styleConfig';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Lock from '../../../assets/images/lock.svg';
import PersonWithPlant from '../../../assets/images/person-with-plant.svg';
import auth from '@react-native-firebase/auth';

import { useSelector, useDispatch } from 'react-redux';
import { userSuccess, saveUserData, saveUserVehicles } from 'reduxStore/actions/auth';

import UserService from 'networkServices/UserService';
import { showHUD, hideHUD } from 'utils/loader';
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';
import Toast from 'react-native-simple-toast';

import { OTP_CELL_COUNT, bypassValue, errorPopUp } from 'utils/Common';
import { get, isEmpty } from 'lodash';

import EnvironmentStore from "utils/EnvironmentStore";
import axios from 'axios'

import OTPInputView from '@twotalltotems/react-native-otp-input';
import RNOtpVerify from 'react-native-otp-verify';
import CountDown from 'react-native-countdown-component';

const isIOS = Platform.OS === 'ios';

const Verify = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const dispatch = useDispatch();
    const prefix = props.route?.params?.prefix;
    const phoneNumber = props.route?.params?.phone;
    const [random, SetRandom] = useState(Math.random());
    const [counter, SetCounter] = useState(59);

    const { loginInfo, deviceFCMToken } = useSelector((state) => state.auth);

    const [confirm, setConfirm] = useState(null);
    const [value, setValue] = useState('');
    const [isResend, setIsResend] = useState(false)
    const ref = useBlurOnFulfill({ value, cellCount: OTP_CELL_COUNT });
    const [inputProps, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const userVehicle = async (loginData) => {
        const isConnected = await checkInternet();
        if (isConnected) {
            const vehicleData = await UserService.getVehicleList(loginData);
            if (isGetSuccessData(vehicleData)) {
                const validateVehicleData = get(vehicleData, 'data', '');
                saveUserVehicles(validateVehicleData);
            }
        }
        else {
            showInternetLostAlert(() => {
                userVehicle(loginData);
            });
        }
    }

    async function getUserInfo(loginInfo) {
        const isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const userProfileData = await UserService.getUserProfile(loginInfo);
            // console.log('--- userProfileData ---', userProfileData)
            hideHUD();
            if (isGetSuccessData(userProfileData)) {
                const validateUserData = get(userProfileData, 'data', '');
                dispatch(saveUserData(validateUserData));
            } else {
                apiFallBackAlert(userProfileData, dark);
            }
        } else {
            showInternetLostAlert(() => {
                getUserInfo();
            });
        }
    }

    async function tempAPI(data) {


        // let token = get(data, 'token', '');
        // let userId = get(data, 'userid', '')

        // // console.log('--- getHomePageDetails ---')
        // // console.log(token)
        // // console.log(userId)
        // // console.log(params)


        let result = {};
        try {
            // hideAlert();
            let api_name = "home/userFirebaseLogin";
            // const response = await client.public_post(api_name, token, userId, params);
            result = await axiosPost(api_name, data);
            // // console.log('--- resp 123 ---', response)
            // result = JSON.parse(response)
        }
        catch (e) {
            // console.log(e)
            // console.log('--- in temp cache ---', e)
            //TODO: error logs
        }
        return result;
    }

    async function axiosPost(path, data) {
        return new Promise(async (resolve, reject) => {
            // console.log('--- axios ---');
            // console.log(path)
            // // console.log(token)
            // // console.log(userId)
            // console.log(data)

            // let url = this.url(path)
            let url = EnvironmentStore.getApiHost('test') + '/' + path;
            let response = null;
            // console.log(url)

            // const headers = {
            //     'token': token,
            //     'userid': userId
            // }

            await axios.post(url, data)
                .then((response) => {
                    // console.log('--- axiosPost ---');
                    // console.log(response)
                    // const jsonObj= JSON.parse(response)
                    resolve(response.data)
                    // response = response
                })
                .catch((error) => {
                    // console.log('--- in cache ---', error)
                })

            // return response;
        })

    }

    const saveUserLogin = async (idToken) => {
        const { reset } = props.navigation;
        let isConnected = await checkInternet();
        if (isConnected) {
            // const loginPayload = [
            //     { name: "firebaseToken", data: deviceFCMToken },
            //     { name: "phoneNumber", data: phoneNumber },
            //     { name: "idToken", data: String(idToken) },
            //     { name: "bypass", data: bypassValue },
            // ]
            const loginPayload = {
                "firebaseToken": String(deviceFCMToken),
                "phoneNumber": String(phoneNumber),
                "idToken": String(idToken),
                "bypass": bypassValue
            }
            // const loginPayload = {
            //     "firebaseToken": "cBzc5_9wRi-aDNWpZxs4R6:APA91bHoygh6_yC-edP_BxTlWKZJc2C0vIv0kPDrK8_hmLoPkDPW_imuXxwvPl6Lt3uSYcKGUwljkaBVRtfAcc8cahzIRsZJ95v8lwln91XZEPzJLer3_DAaYnVX-bH41Qm8ARotrZXy",
            //     "phoneNumber": "9909245163",
            //     "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImJmMWMyNzQzYTJhZmY3YmZmZDBmODRhODY0ZTljMjc4ZjMxYmM2NTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdm9sdHBhbmRhYXBwIiwiYXVkIjoidm9sdHBhbmRhYXBwIiwiYXV0aF90aW1lIjoxNjU4Mjk2NjIwLCJ1c2VyX2lkIjoiTHpma3pjdkQxelNMbnN5QUcwNUJVM0VLMGJuMSIsInN1YiI6Ikx6Zmt6Y3ZEMXpTTG5zeUFHMDVCVTNFSzBibjEiLCJpYXQiOjE2NTgyOTY2MjAsImV4cCI6MTY1ODMwMDIyMCwicGhvbmVfbnVtYmVyIjoiKzkxOTkwOTI0NTE2MyIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsicGhvbmUiOlsiKzkxOTkwOTI0NTE2MyJdfSwic2lnbl9pbl9wcm92aWRlciI6InBob25lIn19.G_CVe-TjEH7bel2JsCzHpOXFXGyyMyJmeAW4OvQ1-Z4deyXWcUpWN7VjFXjHIJ7DUTNmgZar3BP5wb2l2e-YX0p-d5u8XWFTSu7QiRn7ShutK87hEgJfYO9sum_8h_cNspc1BddD64Go7VBi4QVtljRQi20Mr6GazOg6m-embZ-AE4KVpUmZjb03_JNZzJNW1UplGnsj8LKuwEgQUZT7k9UUEUMD4uNegsXKIVRwWICTYz3QMkjHL2Yg1gf2wlvNZhR1NiBp4DyGynbsildJVbD_p6G-8AZHYrjLpYV_VfFxRl2J4Eb_RJ4At5arzDvkpL_Zg2TDKfL5yxOj_9J92w",
            //     "bypass": 405605
            // }
            // const loginPayload = [
            //     { name: "firebaseToken", data: loginPayload1.firebaseToken },
            //     { name: "phoneNumber", data: loginPayload1.phoneNumber },
            //     { name: "idToken", data: String(loginPayload1.idToken) },
            //     { name: "bypass", data: loginPayload1.bypassValue },
            // ]
            // console.log('--- loginPayload ---', loginPayload)
            showHUD();
            const userLoginResponse = await UserService.userLogin(JSON.stringify(loginPayload));
            // const userLoginResponse = await tempAPI(loginPayload);
            // console.log('--- userLoginResponse ---', userLoginResponse)
            hideHUD();
            if (isGetSuccessData(userLoginResponse)) {
                const userData = get(userLoginResponse, 'data', null);
                if (userData) {

                    const loginData = get(userData, 'sessionData', null);
                    const userInformation = get(userData, 'userData', null);

                    // getUserInfo(loginData);

                    dispatch(userSuccess(loginData));
                    dispatch(saveUserData(userInformation));

                    if (get(userInformation, 'Email', null)) {
                        reset({
                            index: 0,
                            routes: [{ name: 'App' }]
                        })
                    } else {
                        reset({
                            index: 0,
                            routes: [{
                                name: 'App',
                                state: {
                                    routes: [{ name: 'PersonalInfo', params: { fromScreen: 'splash' } }]
                                },
                            }]
                        })
                    }
                } else {
                    apiFallBackAlert(userLoginResponse, dark)
                }
            }
        } else {
            showInternetLostAlert(() => {
                saveUserLogin(idToken)
            });
        }
    }

    async function confirmCode(code) {
        try {
            let data = await confirm.confirm(code);
            const idTokenResult = await auth().currentUser.getIdTokenResult();
            const idToken = get(idTokenResult, 'token', null);
            // const idToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImVhNWY2NDYxMjA4Y2ZmMGVlYzgwZDFkYmI1MjgyZTkyMDY0MjAyNWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdm9sdHBhbmRhLWM1M2RlIiwiYXVkIjoidm9sdHBhbmRhLWM1M2RlIiwiYXV0aF90aW1lIjoxNjU3ODAzNjU1LCJ1c2VyX2lkIjoiWUJCN05jc1Z0M1hpa09VbFlmdjNjQm9hcVprMSIsInN1YiI6IllCQjdOY3NWdDNYaWtPVWxZZnYzY0JvYXFaazEiLCJpYXQiOjE2NTc4MDM2NTUsImV4cCI6MTY1NzgwNzI1NSwicGhvbmVfbnVtYmVyIjoiKzkxOTE3MzQ4ODQ2MSIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsicGhvbmUiOlsiKzkxOTE3MzQ4ODQ2MSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBob25lIn19.i7UoSXq3DtHi0qIG05wjacARGprGaSNWMlMWs0oiB9uU42_eUEMwGN9mI3ruB_dKqGO3cMLA7o75g8Lu4AUVfVYD7ObdJZKrwHgITvNuRU5PnvaVnAIBXJJBL4yOJSXSpPUfOen-npXF0zActM1HFRbjvCZ-oDADiUJokkn8IDYDkhQylVK-ACgsJyxkZmH7gvfOR1o3g4ATu9bkKC2TJEntAIUTiYn1Gr4760QxLxSBXI8Kooyie144AXHSll3Y8usZPiN77LMeRZ0c3Nt8y_K3oiGDdko7SuRJOMeEx5H_-CwpZmh1Q5jTEKShFFfFu6ibfL00kq3WicB7cZ0zTQ'
            // console.log('User JWT: ', idTokenResult.token);
            // console.log('data', data);

            if (idToken) {
                saveUserLogin(idToken);
                // const loginPayload = [
                //     { name: "firebaseToken", data: deviceFCMToken },
                //     { name: "phoneNumber", data: phoneNumber },
                //     { name: "idToken", data: idToken },
                //     { name: "bypass", data: bypassValue },
                // ]
                // const userLoginResponse = await UserService.userLogin(loginPayload);
                // if (!isEmpty(userLoginResponse)) {
                //     if (get(userLoginResponse, 'statusCode', 400) === 200) {
                //         const userData = get(userLoginResponse, 'data', null);
                //         if (userData) {
                //             dispatch(userData);
                //         }
                //     }
                // }
            } else {
                errorPopUp(dark, 'Something went wrong!!');
            }

        } catch (error) {
            console.log('--- error145 ---', error)
            if (String(error).includes('[auth/session-expired] The sms code has expired. Please re-send the verification code to try again.')) {
                // handleOTPVerificationFallBack()
                setTimeout(() => {
                    const subscriber = auth().onAuthStateChanged(function (user) {
                        console.log('--- user123 ---', user)
                        console.log(auth().currentUser)
                        if (user) {
                            handleOTPVerificationFallBack()
                            return subscriber();
                        } else {
                            Toast.show('Invalid code.', Toast.LONG);
                        }
                    });
                }, 500);
            } else {
                Toast.show('Invalid code.', Toast.LONG);
            }
        }
    }

    async function handleOTPVerificationFallBack() {
        const idTokenResult = await auth().currentUser.getIdTokenResult();
        const idToken = get(idTokenResult, 'token', null);
        if (idToken) {
            saveUserLogin(idToken);
        } else {
            errorPopUp(dark, 'Something went wrong!!');
        }
    }

    const handleChange = (value) => {

        setValue(value);

        // if (value.length === OTP_CELL_COUNT) {
        //     // props.navigation.navigate('PersonalInfo');
        //     // confirmCode(value);

        // }
    }


    const signInWithPhoneNumber = async () => {
        // await auth().settings.appVerificationDisabledForTesting = true;
        // await auth().settings?.isAppVerificationDisabledForTesting = true
        const confirmation = await auth().signInWithPhoneNumber(prefix + phoneNumber);
        setConfirm(confirmation);
    }

    const onResendOTP = async () => {
        const confirmation = await auth().signInWithPhoneNumber((prefix + phoneNumber), true)
            .then(() => {
                Toast.show("OTP Resend Successfully", Toast.LONG);
                setIsResend(false)
            })
            .catch((error) => {
                errorPopUp(dark, error)
            });
        setConfirm(confirmation);
    }

    useEffect(() => {
        const confirmation = props.route?.params?.confirmation;
        console.log('--- confirmation ---', confirmation)
        setConfirm(confirmation);
        if (!isIOS) {
            getHash();
            startListeningForOtp();
        }

        return () => {
            if (!isIOS) {
                RNOtpVerify.removeListener()
            }
        };
    }, [])

    useEffect(() => {
        if (value.length === OTP_CELL_COUNT) {
            confirmCode(value);
        }
    }, [value])

    const getHash = () => {
        try {
            RNOtpVerify.getHash()
                .then(console.log('---'))
                .catch(console.log('---'));
        } catch (error) {
            // console.log('--- startListeningForOtp cache ---', error)
        }

    }

    const startListeningForOtp = () => {
        try {
            RNOtpVerify.getOtp()
                .then(p => RNOtpVerify.addListener(otpHandler))
                .catch(p => console.log(p));
        } catch (error) {
            // console.log('--- startListeningForOtp cache ---', error)
        }

    }

    const otpHandler = (message) => {
        try {
            const otp = /(\d{6})/g.exec(message)[1];
            // this.setState({ otp });
            // console.log('--- otpHandler ---', otp)
            setValue(otp);

            RNOtpVerify.removeListener();
            Keyboard.dismiss();
        } catch (error) {
            // console.log('--- otpHandler cache ---', error)
        }

    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', backgroundColor: dark ? '#0E2831' : '#FFF', paddingTop: hp(7), paddingBottom: hp(4), paddingHorizontal: wp(5) }}>
            <View style={{ alignItems: 'center' }}>
                <Lock />
                <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.title, marginTop: hp(2.27), color: dark ? '#FFF' : '#111' }]}>Verification</Text>
                <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.big, marginTop: hp(2.27), color: dark ? '#FFF' : '#111' }]}>Please enter the OTP code sent to your number</Text>
                <SafeAreaView style={{ marginTop: hp(5) }}>
                    {/* {isIOS
                        ? <OTPInputView
                            style={{ width: '80%', height: 200 }}
                            pinCount={OTP_CELL_COUNT}
                            code={value} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                            onCodeChanged={handleChange}
                            autoFocusOnLoad
                            codeInputFieldStyle={[styles.otpCell, { color: dark ? '#FFF' : colors.GREEN.secondary, borderColor: dark ? 'rgba(255,255,255,0.25)' : '#111', }]}
                            // codeInputHighlightStyle={styles.underlineStyleHighLighted}
                            onCodeFilled={(code => {
                                // console.log(`Code is ${code}, you are good to go!`)
                            })}
                        />
                        : */}
                    <CodeField
                        ref={ref}
                        {...inputProps}
                        value={value}
                        onChangeText={handleChange}
                        cellCount={OTP_CELL_COUNT}
                        rootStyle={{}}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={({ index, symbol, isFocused }) => (
                            <Text
                                key={index}
                                style={{
                                    width: wp(13),
                                    height: wp(13),
                                    lineHeight: wp(13) - 2,
                                    fontSize: fontSizes.title,
                                    // fontSize: 24,
                                    marginHorizontal: wp(1.0),
                                    borderRadius: 6,
                                    borderWidth: 1,
                                    borderColor: dark ? 'rgba(255,255,255,0.25)' : '#111',
                                    color: dark ? '#FFF' : colors.GREEN.secondary,
                                    // borderColor: '#00000030',
                                    textAlign: 'center',
                                }}
                                // style={[{ marginHorizontal: wp(1.0), borderRadius: 6, borderWidth: 1, borderColor: dark ? 'rgba(255,255,255,0.25)' : '#111', height: wp(14.4), width: wp(13), textAlign: 'center', textAlignVertical: 'center', alignItems: 'center', justifyContent: 'center', fontSize: fontSizes.title, color: dark ? '#FFF' : colors.GREEN.secondary }]}
                                onLayout={getCellOnLayoutHandler(index)}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        )}
                    />
                    {/* } */}

                    {/* <CodeField
                        ref={ref}
                        {...inputProps}
                        value={value}
                        onChangeText={handleChange}
                        cellCount={OTP_CELL_COUNT}
                        rootStyle={{}}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={({ index, symbol, isFocused }) => (
                            <Text
                                key={index}
                                style={{
                                    width: wp(13),
                                    height: wp(13),
                                    lineHeight: wp(13) - 2,
                                    fontSize: fontSizes.title,
                                    // fontSize: 24,
                                    marginHorizontal: wp(1.0),
                                    borderRadius: 6,
                                    borderWidth: 1,
                                    borderColor: dark ? 'rgba(255,255,255,0.25)' : '#111',
                                    color: dark ? '#FFF' : colors.GREEN.secondary,
                                    // borderColor: '#00000030',
                                    textAlign: 'center',
                                }}
                                // style={[{ marginHorizontal: wp(1.0), borderRadius: 6, borderWidth: 1, borderColor: dark ? 'rgba(255,255,255,0.25)' : '#111', height: wp(14.4), width: wp(13), textAlign: 'center', textAlignVertical: 'center', alignItems: 'center', justifyContent: 'center', fontSize: fontSizes.title, color: dark ? '#FFF' : colors.GREEN.secondary }]}
                                onLayout={getCellOnLayoutHandler(index)}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        )}
                    /> */}
                </SafeAreaView>

                <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', marginTop: hp(2.5) }}>
                    {isResend ?
                        <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.big, color: dark ? '#FFF' : '#111' }]}>Didn't receive the verifications OTP?</Text>
                        :
                        <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.big, color: dark ? '#FFF' : '#111' }]}>Send a new verification code ?</Text>
                    }
                    {isResend ?
                        <TouchableOpacity activeOpacity={0.7} onPress={() => onResendOTP()}>
                            <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.big, color: colors.GREEN.secondary }]}>Resend again</Text>
                        </TouchableOpacity>
                        :
                        <View style={{ flexDirection: "row" }}>
                            <CountDown
                                key={random}
                                until={counter}
                                size={15}
                                onFinish={() => setIsResend(true)}
                                separatorStyle={{ color: colors.GREEN.secondary }}
                                digitStyle={{ alignSelf: 'center' }}
                                digitTxtStyle={[styles.timerText, { color: colors.GREEN.secondary }]}
                                timeToShow={['S']}
                                showSeparator
                                timeLabels={{ s: '' }}
                            />
                            <View style={{ alignItems: 'center', justifyContent: 'center', bottom: hp(0.1) }}>
                                <Text style={[styles.timerText, { color: colors.GREEN.secondary, alignSelf: "center" }]}>sec</Text>
                            </View>
                        </View>
                    }
                </View>
            </View>
            <PersonWithPlant />
        </View>
    )
}

const styles = StyleSheet.create({
    otpCell: {
        width: wp(13),
        height: wp(13),
        // lineHeight: wp(13) - 2,
        // fontSize: fontSizes.title,
        fontSize: 24,
        marginHorizontal: wp(1.0),
        borderRadius: 6,
        borderWidth: 1,
        // borderColor: '#00000030',
        textAlign: 'center',

        // width: 300,
        // height: 55,
        // marginVertical: 20,
        // borderColor: 'red',
        // borderWidth: 1,
    },
    timer: {
        paddingHorizontal: hp(1)
    },
    timerText: {
        fontFamily: fonts.MULISH.light,
        fontSize: fontSizes.big + 6,
        color: colors.GREEN.secondary,
        fontWeight: 'bold'
    }
})

export default Verify;