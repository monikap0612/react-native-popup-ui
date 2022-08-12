import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Dimensions, Platform } from 'react-native';
import { get, last } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';

import VoltpandaDark from '../../../assets/images/voltpanda-dark.svg';
import VoltpandaLight from '../../../assets/images/voltpanda-light.svg';

import { fcmService } from 'service/FCMService';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import { isEmpty } from 'lodash';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { setFCMToken, userLogout } from 'reduxStore/actions/auth';

import { showHUD, hideHUD } from 'utils/loader';
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';
import UserService from "networkServices/UserService";

import { saveUserData, saveUserVehicles } from 'reduxStore/actions/auth';
import localStorage from "utils/LocalStorage";


const WIDTH = Dimensions.get('screen').width;
const isIOS = Platform.OS === 'ios';

const Splash = (props) => {

    const { dark } = useTheme();
    const dispatch = useDispatch();
    const { loginInfo, userInfo, deviceFCMToken } = useSelector((state) => state.auth);

    useEffect(() => {
        setUpFirebaseNotification();
        updateUserData();

        // dynamicLinks()
        //     .getInitialLink()
        //     .then((link) => {
        //         handleDynamicLink(link);
        //     });

        // const unsubscribe = dynamicLinks().onLink((link) => handleDynamicLink(link));
        // return () => unsubscribe();
    }, [])

    // const handleDynamicLink = link => {
    //     // Handle dynamic link inside your own application
    //     const { navigate, reset } = props.navigation;

    //     // console.log('--- handleDynamicLink ---', link)

    //     if (get(link, 'url', null) != null) {
    //         let locationId = last(get(link, 'url', null).split('/'))
    //         // console.log("---locationId---", locationId)

    //         const locationData = {
    //             "_id": locationId
    //         }
    //         if (isEmpty(loginInfo)) {
    //             updateUserData()
    //         } else {
    //             reset({
    //                 index: 0,
    //                 routes: [{
    //                     name: 'App',
    //                     state: {
    //                         routes: [{
    //                             name: 'Tabs', state: {
    //                                 routes: [{
    //                                     name: 'Home',
    //                                     state: {
    //                                         routes: [{
    //                                             name: 'BookChargingSlot',
    //                                             params: { locationData: locationData }
    //                                         }]
    //                                     }
    //                                 }]
    //                             }
    //                         }]
    //                     }
    //                 }]
    //             })
    //         }
    //     } else {
    //         updateUserData()
    //     }
    // };

    const userVehicle = async () => {
        const isConnected = await checkInternet();
        if (isConnected) {
            const vehicleData = await UserService.getVehicleList(loginInfo);
            if (isGetSuccessData(vehicleData)) {
                const validateVehicleData = get(vehicleData, 'data', '');
                saveUserVehicles(validateVehicleData);
            }
        }
        else {
            showInternetLostAlert(() => {
                userVehicle();
            });
        }
    }

    const updateUserData = async () => {
        if (!isEmpty(loginInfo)) {
            const userProfileData = await UserService.getUserProfile(loginInfo);
            if (isGetSuccessData(userProfileData)) {
                const validateUserData = get(userProfileData, 'data', '');
                dispatch(saveUserData(validateUserData));
                userVehicle();
                hideSplashInitiate();
            } else {
                const statusCode = get(userProfileData, 'statusCode', 500);
                if (statusCode === 401) {
                    dispatch(userLogout());
                    hideSplashInitiate();
                } else {
                    hideSplashInitiate();
                }
            }
        } else {
            hideSplashInitiate();
        }
    }

    const hideSplashInitiate = () => {
        setTimeout(() => {
            hideSplashScreen();
        }, 1500);
    }

    const hideSplashScreen = async () => {
        const { navigate, reset } = props.navigation;
        const IS_LOGIN_SCREEN = await localStorage.getKey('isLoginScreen');

        if (!isEmpty(loginInfo)) {
            if (get(userInfo, 'Email', null)) {
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
            if (IS_LOGIN_SCREEN) {
                reset({
                    index: 0,
                    routes: [{ name: 'Auth' }]
                })
            }
            else {
                reset({
                    index: 0,
                    routes: [{
                        name: 'Auth',
                        state: {
                            routes: [{ name: 'IntroStack' }]
                        },
                    }]
                })
            }
        }
    }

    const setUpFirebaseNotification = () => {
        if (isIOS) {
            PushNotificationIOS.requestPermissions().then(
                (data) => {
                    fcmService.registerAppWithFCM();
                    fcmService.register(onRegister, onNotification, onOpenNotification);
                },
                (data) => {
                    // console.log('PushNotificationIOS.requestPermissions failed', data);
                },
            );
        } else {
            fcmService.registerAppWithFCM();
            fcmService.register(onRegister, onNotification, onOpenNotification);
        }
    }

    function onRegister(token) {
        // console.log('[App] onRegister', token);
        if (deviceFCMToken !== token) {
            dispatch(setFCMToken(token));
        }
    }

    function onNotification(notify) {
        // console.log('[App] onNotification', notify);
    }

    function onOpenNotification(notify) {
        // console.log('[App] onOpenNotification', notify);
    }

    return (
        <View style={{ flex: 1, backgroundColor: dark ? '#0E2831' : '#FFF', justifyContent: 'center', alignItems: 'center' }}>
            {
                dark ?
                    <VoltpandaLight width={WIDTH * 0.9} />
                    :
                    <VoltpandaDark width={WIDTH * 0.9} />
            }
        </View>
    )
}

export default Splash;