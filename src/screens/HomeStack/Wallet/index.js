import React, { useState, useEffect } from "react";
import { useTheme, useNavigation } from "@react-navigation/native";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';
import { Button, StyledText } from 'components';
import { errorPopUp, quickTopUpOption, razorPayKey, warningPopUp } from 'utils/Common';
import { useSelector, useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import RazorpayCheckout from 'react-native-razorpay';

import TopUpService from "networkServices/TopUpService";
import { isGetSuccessData, checkInternet, showInternetLostAlert, apiFallBackAlert } from 'networkServices/networkHelper';
import { showHUD, hideHUD } from 'utils/loader';

import zapCircle from 'assets/images/zap-circle.png';
import { get, isEmpty, map, omit } from "lodash";
import UserService from "networkServices/UserService";
import { setNotificationData } from "reduxStore/actions/notification";

const Wallet = (props) => {
    // Gets the current theme. Dark or light
    const fromScreen = props.route?.params?.fromScreen;

    const navigation = useNavigation();
    const routes = navigation.getState().routeNames;

    const { dark } = useTheme();
    const dispatch = useDispatch();

    const { loginInfo, userInfo } = useSelector((state) => state.auth);
    // const { homeDetails } = useSelector((state) => state.home);
    const { homeDetails } = useSelector((state) => state.home);
    const { notificationConfig } = useSelector((state) => state.notification);

    const [quickTopUpList, setQuickTopUpList] = useState(quickTopUpOption)
    const [amountIndex, setAmountIndex] = useState(1);
    const [topUpInput, setTopUpInput] = useState('500');

    const walletBalance = get(notificationConfig, 'Wallet', '-');
    // console.log("----walletBalance---", walletBalance)
    // console.log('--- wallet ---', routes)
    const processTransaction = (amount) => {
        props.navigation.navigate('Transaction', {
            amount: topUpInput, currency: '₹', transactionId: 'pay_JtvxcChpKQd23Q', fromScreen: fromScreen
        });
    }

    function handleRouting() {
        if (fromScreen === 'ChargingInitialization') {
            props.navigation.goBack();
        }
    }

    const onVerifyTopUp = (initiateTopUpPayload) => {
        return new Promise(async (resolve, reject) => {
            let isConnected = await checkInternet();
            if (isConnected) {
                const topUpVerify = await TopUpService.requestTopUpVerify(initiateTopUpPayload);
                if (isGetSuccessData(topUpVerify)) {
                    const response = get(topUpVerify, 'data', null);
                    resolve(response)
                } else {
                    warningPopUp('Payment Success, not able to connect with app server!!', dark);
                }
            } else {
                showInternetLostAlert(async () => {
                    const isVerifyTopUp = await onVerifyTopUp(initiateTopUpPayload);
                    resolve(isVerifyTopUp)
                });
            }
        })

    }

    const navToRazorPay = (topUpOrderData) => {
        return new Promise((resolve, reject) => {
            let options = {
                description: 'VoltPanda top Up',
                image: zapCircle,
                currency: get(topUpOrderData, 'currency', 'INR'),
                key: razorPayKey, // Your api key
                order_id: get(topUpOrderData, 'id', null),
                amount: parseInt(topUpInput),
                name: get(userInfo, 'Name', ""),
                prefill: {
                    email: get(userInfo, 'Email', null),
                    contact: get(userInfo, 'PhoneNumber', null),
                    name: 'VoltPanda top Up'
                },
                theme: { color: dark ? '#0E2831' : '#FFF' }
            }
            RazorpayCheckout.open(options).then(async (data) => {
                // handle success
                const initiateTopUpPayload = {
                    loginInfo,
                    apiBody: [
                        { name: "order_id", data: get(data, 'razorpay_order_id', null) },
                        { name: "payment_id", data: get(data, 'razorpay_payment_id', null) },
                        { name: "TransID", data: get(topUpOrderData, 'TransID', null) },
                        { name: "signature", data: get(data, 'razorpay_signature', null) },
                    ]
                }
                showHUD();
                const verifiedTopUp = await onVerifyTopUp(initiateTopUpPayload);
                // console.log('--- verifiedTopUp ---', verifiedTopUp)
                hideHUD();
                resolve(verifiedTopUp)
                // alert(`Success: ${data.razorpay_payment_id}`);
            }).catch((error) => {
                // handle failure
                errorPopUp(dark, `Error: ${error.code} | ${error.description}`);
            });
        })
    }

    const onInitiatePayment = async () => {
        let isConnected = await checkInternet();
        if (isConnected) {
            const { navigate } = props.navigation;
            const validateTopUpValue = parseInt(topUpInput);

            if (validateTopUpValue > 0) {
                const initiateTopUpPayload = {
                    loginInfo,
                    apiBody: [
                        { name: "Amount", data: String((topUpInput)) },
                    ]
                }
                showHUD();
                const initiateTopUp = await TopUpService.initiateTopUp(initiateTopUpPayload);
                if (isGetSuccessData(initiateTopUp)) {
                    hideHUD();
                    const topUpOrderData = get(initiateTopUp, 'data', null);
                    const verifyPayment = await navToRazorPay(topUpOrderData);
                    if (!isEmpty(verifyPayment)) {
                        getNotificationData();
                        navigate('Transaction', { amount: topUpInput, currency: '₹', transactionId: get(topUpOrderData, 'TransID', null) });
                    }
                } else {
                    hideHUD();
                    errorPopUp(dark, 'not getting response from server!!')
                }
            } else {
                warningPopUp('Please enter amount to proceed!!', dark)
            }
        } else {
            showInternetLostAlert(() => {
                onInitiatePayment();
            });
        }

    }

    async function getNotificationData() {
        const notificationData = await UserService.getNotificationList(loginInfo);
        if (isGetSuccessData(notificationData)) {
            let notification_Data = get(notificationData, 'data', '')
            let validateNotificationData = get(notification_Data, 'NotificationList', '');
            const mapNotificationListData = map(validateNotificationData, (el) => {
                return { ...el, isExpanded: get(el, 'StatusRead', false) == false ? false : true }
            })

            let mapNotificationData = {
                ...omit(notification_Data, 'NotificationList'),
                NotificationList: mapNotificationListData
            }

            dispatch(setNotificationData(mapNotificationData))
        }
    }

    const testRazorPay = () => {
        var options = {
            description: 'VoltPanda top Up',
            image: zapCircle,
            currency: 'INR',
            key: razorPayKey, // Your api key
            // order_id: 'order_Ju0ycwBi53Lne1',
            amount: parseInt(topUpInput) * 100,
            name: 'VoltPanda Test User',
            prefill: {
                email: 'void@razorpay.com',
                contact: '9191919191',
                name: 'Razorpay Software'
            },
            theme: { color: dark ? '#0E2831' : '#FFF' }
        }
        RazorpayCheckout.open(options).then((data) => {
            // handle success
            // console.log('---- razorPay success ---', data)
            props.navigation.navigate('Transaction', { amount: topUpInput, currency: '₹', transactionId: data.razorpay_payment_id });
            // alert(`Success: ${data.razorpay_payment_id}`);
        }).catch((error) => {
            // handle failure
            errorPopUp(dark, `Error: ${error.code} | ${error.description}`);
        });
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flex: 1, paddingTop: hp(4.5), paddingBottom: hp(12) }} style={{ backgroundColor: dark ? '#0E2831' : '#FFF' }}>
            {/* <View style={{ paddingBottom: hp(2) }}>
                <StyledText style={{ marginLeft: wp(5) }} font='light' size={24} color={dark ? '#FFF' : '#111'}>Wallet Balance</StyledText>
                <ScrollView decelerationRate={0} snapToInterval={wp(60)} snapToAlignment={'center'} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingTop: hp(2), paddingRight: wp(25) }}>
                    <View style={{ borderRadius: 6, backgroundColor: dark ? '#003946' : '#FFF', elevation: dark ? 0 : 4, paddingTop: 25, paddingBottom: 18, alignItems: 'center', paddingHorizontal: 30, marginBottom: 10, marginLeft: wp(5), width: wp(55) }}>
                        <View style={styles.greenCircle}>
                            <Feather name='plus' size={34} />
                        </View>
                        <Text style={[{ fontFamily: fonts.MULISH.semiBold, fontSize: fontSizes.big, marginTop: 6, color: dark ? '#FFF' : '#111' }]}>Add Payment Method</Text>
                    </View>
                    <View style={{ borderRadius: 6, backgroundColor: colors.GREEN.secondary, paddingTop: 25, paddingBottom: 18, paddingHorizontal: 30, marginLeft: wp(4), justifyContent: 'space-between', marginBottom: 10, width: wp(50) }}>
                        <Image style={{ height: 20, width: 60 }} resizeMode='cover' source={require('../../../assets/icons/visa.png')} />
                        <View>
                            <Text style={{ fontFamily: fonts.MULISH.semiBold, fontSize: fontSizes.big, color: '#FFF' }}>Available Balance</Text>
                            <Text style={{ fontFamily: fonts.MULISH.bold, fontSize: fontSizes.extraBig, color: colors.BLUEGREY.other }}>**** 1234</Text>
                        </View>
                    </View>
                </ScrollView>
            </View> */}
            <KeyboardAwareScrollView extraHeight={65} enableOnAndroid={true} showsVerticalScrollIndicator={false}>
                <View style={{ paddingTop: hp(2), paddingHorizontal: wp(5) }}>
                    <StyledText font='light' size={24} color={dark ? '#FFF' : '#111'}>Current Amount</StyledText>
                    <StyledText font='bold' size={64} color={dark ? '#FFF' : colors.GREEN.secondary}>₹ {walletBalance}</StyledText>
                </View>

                <View style={{ paddingVertical: hp(2), paddingHorizontal: wp(5) }}>
                    <StyledText font='light' size={24} color={dark ? '#FFF' : '#111'}>Choose Amount</StyledText>
                    <View style={[globalStyle.rowContainerCenteredSpaced, { marginTop: 20 }]}>
                        <TouchableWithoutFeedback onPress={() => { setAmountIndex(0), setTopUpInput('100') }}>
                            <View style={[styles.rectangle, { backgroundColor: amountIndex == 0 ? colors.GREEN.secondary : dark ? '#003946' : '#FFF', elevation: dark ? 0 : 4 }]}>
                                <Text style={[styles.rectangleText, { color: amountIndex == 0 ? '#FFF' : dark ? '#FFF' : '#0A0A26' }]}>100</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => { setAmountIndex(1), setTopUpInput('500') }}>
                            <View style={[styles.rectangle, { backgroundColor: amountIndex == 1 ? colors.GREEN.secondary : dark ? '#003946' : '#FFF', elevation: dark ? 0 : 4 }]}>
                                <Text style={[styles.rectangleText, { color: amountIndex == 1 ? '#FFF' : dark ? '#FFF' : '#0A0A26' }]}>500</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => { setAmountIndex(2), setTopUpInput('1000') }}>
                            <View style={[styles.rectangle, { backgroundColor: amountIndex == 2 ? colors.GREEN.secondary : dark ? '#003946' : '#FFF', elevation: dark ? 0 : 4 }]}>
                                <Text style={[styles.rectangleText, { color: amountIndex == 2 ? '#FFF' : dark ? '#FFF' : '#0A0A26' }]}>1000</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => { setAmountIndex(3), setTopUpInput('1500') }}>
                            <View style={[styles.rectangle, { backgroundColor: amountIndex == 3 ? colors.GREEN.secondary : dark ? '#003946' : '#FFF', elevation: dark ? 0 : 4 }]}>
                                <Text style={[styles.rectangleText, { color: amountIndex == 3 ? '#FFF' : dark ? '#FFF' : '#0A0A26' }]}>1500</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>

                <View style={{ paddingVertical: hp(2), paddingHorizontal: wp(5) }}>
                    <StyledText font='light' size={24} color={dark ? '#FFF' : '#111'}>Enter Manual Amount</StyledText>
                    <View style={[globalStyle.rowContainer, { backgroundColor: dark ? '#003946' : '#efefef', borderRadius: 50, overflow: 'hidden', marginTop: 20 }]}>
                        <View style={{ flex: 1, height: 50, justifyContent: 'center', paddingLeft: 16 }}>
                            <TextInput
                                placeholder="Enter amount"
                                style={{ fontFamily: fonts.MULISH.light, color: dark ? 'rgba(255,255,255,0.4)' : '#000', fontSize: fontSizes.regular }}
                                value={topUpInput}
                                keyboardType={'number-pad'}
                                onChangeText={(input) => setTopUpInput(input.replace(/[^0-9]/g, ''))}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => onInitiatePayment()}
                            // onPress={() => testRazorPay()}
                            activeOpacity={0.7}
                            style={[globalStyle.centeredContent, { paddingHorizontal: 30, backgroundColor: colors.GREEN.secondary }]}>
                            <Text style={[{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.extraBig, color: '#FFF' }]}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: wp(5) }}>
                    <Button label='Add Amount' onPress={() => onInitiatePayment()} />
                    {/* <Button label='Add Amount' onPress={() => processTransaction('500')} /> */}
                </View>
            </KeyboardAwareScrollView>
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
        alignItems: 'center'
    },
    rectangle: {
        borderRadius: 8,
        backgroundColor: '#003946',
        justifyContent: 'center',
        alignItems: 'center',
        height: hp(5.8),
        width: wp(18.7)
    },
    rectangleText: {
        fontFamily: fonts.MULISH.bold,
        fontSize: fontSizes.xExtraBig
    }
})

export default Wallet;