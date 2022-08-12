import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, View, Dimensions } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Textbox, StickyHeader } from 'components';
import { colors, fonts, fontSizes } from 'styleConfig';
import CarsAndManDark from '../../../assets/images/cars-and-man-dark.svg';
import CarsAndManLight from '../../../assets/images/cars-and-man-light.svg';
import UserService from "networkServices/UserService";
import { useSelector, useDispatch } from 'react-redux';
import { get, isEmpty, size } from "lodash";

import { saveUserData } from 'reduxStore/actions/auth';
import { showHUD, hideHUD } from "utils/loader";
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';
import { warningPopUp } from "utils/Common";

const { height, width } = Dimensions.get('screen');

const PersonalInfo = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const dispatch = useDispatch();

    const fromScreen = props.route?.params?.fromScreen;

    const { loginInfo, userInfo, deviceFCMToken, userVehicles } = useSelector((state) => state.auth);

    const [name, setName] = useState(get(userInfo, 'Name', null));
    const [email, setEmail] = useState(get(userInfo, 'Email', null));
    const [Gst, setGst] = useState(get(userInfo, 'GST', null));

    let updatedUserData = [
        { name: "Name", data: name },
        { name: "Email", data: email },
        { name: "GST", data: Gst },
    ]

    async function getUserInfo() {
        const isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const userProfileData = await UserService.getUserProfile(loginInfo);
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

    function validateInputField() {
        const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

        if (!name) {
            warningPopUp('Please enter your name!!', dark)
        } else if (!(size(email) > 0)) {
            warningPopUp('Please enter your email address!!', dark)
        } else if (emailReg.test(email) === false) {
            warningPopUp('Please enter valid email address!!', dark)
        } else {
            updateUserInfo()
        }
    }

    async function updateUserInfo() {
        const { goBack, navigate, reset } = props.navigation
        const isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const isUpdateUserData = await UserService.updateUserProfile(loginInfo, updatedUserData);
            hideHUD();
            if (isGetSuccessData(isUpdateUserData)) {
                getUserInfo();
                if (fromScreen === 'splash') {
                    navigate('AddVehicle', { fromVehicleScreen: false })
                    // reset({
                    //     index: 0,
                    //     routes: [{ name: 'App' }]
                    // })
                    // if(isEmpty(userVehicles)) {
                    //     navigate('')
                    // } else {
                    //     navigate('')
                    // }
                } else {
                    goBack()
                }
            } else {
                apiFallBackAlert(isUpdateUserData, dark)
            }
        } else {
            showInternetLostAlert(() => {
                updateUserInfo();
            });
        }
    }

    useEffect(() => {
        getUserInfo();
    }, [])

    return (
        <View style={{ flexGrow: 1, backgroundColor: dark ? '#0E2831' : '#FFF', }}>
            <StickyHeader {...props} headerTitle="PersonalInfo" />
            <View style={{ flex: 1, backgroundColor: dark ? '#0E2831' : '#FFF', marginTop: 8, }}>

                <View style={{ width: width, height: 205 }}>
                    {
                        dark ?
                            <CarsAndManDark />
                            :
                            <CarsAndManLight />
                    }
                    <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: dark ? colors.BLUEGREY.secondary : '#f4f4f4', height: '77%', zIndex: -1 }} />
                </View>

                <View style={{ alignItems: 'center' }}>
                    <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.title, color: dark ? '#FFF' : '#111' }]}>Tell us about yourself</Text>
                    <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.xRegular, marginTop: hp(1), color: dark ? '#FFF' : '#111' }]}>Fill the below form and update your personal information</Text>
                </View>
                <KeyboardAwareScrollView extraHeight={-65}>
                    <View style={{ alignItems: 'center', paddingHorizontal: wp(4.9), marginTop: hp(5) }}>
                        <Textbox borderColor={dark ? colors.GREEN.secondary : '#111'} placeholderTextColor={dark ? '#FFF' : '#111'} style={{ color: dark ? '#FFF' : '#111', flex: 1 }} image={dark ? require('../../../assets/icons/user.png') : require('../../../assets/icons/user-dark.png')} placeholder='Enter your full name'
                            value={name} onChange={(text) => setName(text)} />
                        <Textbox borderColor={dark ? colors.GREEN.secondary : '#111'} placeholderTextColor={dark ? '#FFF' : '#111'} style={{ color: dark ? '#FFF' : '#111', flex: 1 }} image={dark ? require('../../../assets/icons/mail.png') : require('../../../assets/icons/mail-dark.png')} placeholder='Enter your email address'
                            value={email} onChange={(text) => setEmail(text)} />
                        <Textbox borderColor={dark ? colors.GREEN.secondary : '#111'} placeholderTextColor={dark ? '#FFF' : '#111'} style={{ color: dark ? '#FFF' : '#111', flex: 1 }} image={dark ? require('../../../assets/icons/invoice-dark.png') : require('../../../assets/icons/invoice-light.png')} placeholder='Enter your GST number (Optional)'
                            value={Gst} onChange={(text) => setGst(text)} />
                        {/* <Textbox borderColor={dark ? colors.GREEN.secondary : '#111'} placeholderTextColor={dark ? '#FFF' : '#111'} style={{ color: dark ? '#FFF' : '#111' }} image={dark ? require('../../../assets/icons/lock.png') : require('../../../assets/icons/lock-dark.png')} placeholder='Enter your GST number (Optional)' 
                /> */}
                        <Button label='Update Profile' onPress={() => validateInputField()} />
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </View>
    )
}

export default PersonalInfo;