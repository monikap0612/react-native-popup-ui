import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableWithoutFeedback, View, BackHandler } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CheckCircle from '../../../assets/images/check-circle.svg';
import { StyledText, Button } from 'components';
import { colors, globalStyle } from 'styleConfig';
import WalletWhite from '../../../assets/icons/wallet-white.svg';
import { useSelector, useDispatch } from 'react-redux';
import { get } from 'lodash';
import moment from 'moment';
import UserService from "networkServices/UserService";
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';
import { showHUD, hideHUD } from "utils/loader";
import { resetChargingRedux, markAsCompleteCharge } from 'reduxStore/actions/charging';
import { msToHMS, ssToHMS } from 'utils/Common';

const ChargingSuccess = (props) => {

    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const dispatch = useDispatch();
    const { connectorInfo, verifiedCharging, startChargingInfo, locationInfo } = useSelector((state) => state.charging);
    const { loginInfo } = useSelector((state) => state.auth);
    const { chargingInfo } = props.route?.params

    useEffect(() => {
        dispatch(markAsCompleteCharge(true))

        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
        };
    }, [])

    function handleBackButtonClick() {
        return true;
    }
    // useEffect(() => {
    //     getChargingDetails()
    // })

    // async function getChargingDetails() {
    //     const { chargingInfo} = props.route.params

    //     const Obj = [
    //         { name: "ChargingSessionId", data: get(chargingInfo, 'ChargingSessionId', '') },
    //         { name: "transaction_id", data: get(chargingInfo, 'transaction_id', '') },
    //     ];

    //     let isConnected = await checkInternet();
    //     if (isConnected) {
    //         showHUD();
    //         const chargingDetails = await UserService.chargingDetails(loginInfo, Obj);
    //         // console.log("---chargingDetails---", chargingDetails);
    //         hideHUD();
    //         if (isGetSuccessData(chargingDetails)) {
    //         }
    //         else {
    //             apiFallBackAlert(chargingDetails)
    //         }
    //     }
    //     else {
    //         showInternetLostAlert(() => {
    //             getChargingDetails()
    //         });
    //     }
    // }

    const onChargingDetail = () => {
        const { reset } = props.navigation;
        dispatch(resetChargingRedux())
        // props.navigation.navigate('ChargingDetails', {
        //     chargingInfo: chargingInfo
        // })
        reset({
            index: 0,
            routes: [{
                name: 'App',
                state: {
                    routes: [{ name: 'Home' }]
                },
            }]
        })
        // props.navigation.navigate('Home')
    }

    return (
        <View style={{ flex: 1, backgroundColor: dark ? '#0E2831' : '#FFF', paddingHorizontal: wp(4.7), paddingBottom: hp(8.5), paddingTop: hp(2) }}>
            <View style={{ alignSelf: 'center', marginBottom: -hp(6), zIndex: 1 }}>
                <CheckCircle height={hp(12)} width={hp(12)} />
            </View>

            <View style={{ flexGrow: 1, borderRadius: 8, backgroundColor: dark ? colors.BLUEGREY.secondary : '#FAFAFA', paddingTop: hp(7.5), paddingBottom: wp(4), marginBottom: hp('8%'), overflow: 'hidden' }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <StyledText center font='bold' size={32} color={colors.GREEN.secondary}>Successful</StyledText>
                    <StyledText center font='regular' size={16} color={dark ? '#FFF' : '#0A0A26'}>Your vehicle was successfully charged</StyledText>

                    {/* Separator  */}
                    <View style={[globalStyle.rowContainerCentered, { marginTop: hp(2) }]}>
                        <View style={{ backgroundColor: dark ? '#0E2831' : '#FFF', borderRadius: 50, height: 24, width: 24, marginLeft: -12 }} />
                        <View style={{ height: 1, flex: 1, backgroundColor: dark ? 'rgba(0,0,0,0.17)' : 'rgba(0,0,0,0.17)' }} />
                        <View style={{ backgroundColor: dark ? '#0E2831' : '#FFF', borderRadius: 50, height: 24, width: 24, marginRight: -12 }} />
                    </View>

                    <View style={{ paddingHorizontal: wp(3.8) }}>

                        <View style={{ paddingVertical: hp(2) }}>
                            <StyledText font='regular' size={16} color={dark ? '#FFF' : '#0A0A26'}>Charging Station</StyledText>
                            <StyledText font='semiBold' size={18} color={dark ? '#FFF' : '#0A0A26'}>{get(locationInfo, 'LocalAreaName', '')}</StyledText>
                        </View>

                        <View style={{ paddingVertical: hp(2) }}>
                            <StyledText font='regular' size={16} color={dark ? '#FFF' : '#0A0A26'}>Charging ID</StyledText>
                            <StyledText font='semiBold' size={18} color={dark ? '#FFF' : '#0A0A26'}>{get(startChargingInfo, 'ChargingSessionId', '')}</StyledText>
                        </View>

                        <View style={[globalStyle.rowContainerCenteredSpaced, { paddingVertical: hp(2) }]}>
                            <View>
                                <StyledText font='regular' size={16} color={dark ? '#FFF' : '#0A0A26'}>Start Time</StyledText>
                                {/* 12 May 2022 10.00 AM */}
                                <StyledText font='semiBold' size={18} color={dark ? '#FFF' : '#0A0A26'}>{moment.unix(parseInt(get(chargingInfo, 'StartTime', null))).format("DD MMM YYYY HH.mm A")}</StyledText>
                                {/* <StyledText font='semiBold' size={18} color={dark ? '#FFF' : '#0A0A26'}>{moment(parseInt(get(chargingInfo, 'StartTime', null))).format("DD MMM YYYY HH.mm A")}</StyledText> */}
                            </View>
                            <View>
                                <StyledText font='regular' size={16} color={dark ? '#FFF' : '#0A0A26'}>Duration</StyledText>
                                <StyledText font='semiBold' size={18} color={dark ? '#FFF' : '#0A0A26'}>{ssToHMS(get(chargingInfo, 'TotalTime', null))}Hrs</StyledText>
                            </View>
                        </View>

                        <View style={[globalStyle.rowContainerCenteredSpaced, { paddingVertical: hp(2) }]}>
                            <View>
                                <StyledText font='regular' size={16} color={dark ? '#FFF' : '#0A0A26'}>Total Pay</StyledText>
                                <StyledText font='semiBold' size={18} color={dark ? '#FFF' : '#0A0A26'}>₹{parseFloat(get(chargingInfo, 'TotalAmount')).toFixed(2)}</StyledText>
                            </View>
                            <TouchableWithoutFeedback onPress={() => { }}>
                                <View style={{ borderRadius: 50, backgroundColor: colors.GREEN.secondary, justifyContent: 'center', alignItems: 'center', height: hp(5), paddingHorizontal: wp(6.3) }}>
                                    <StyledText font='semiBold' size={16} color={'#FFF'}>COMPLETED</StyledText>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                        <View style={{ flexDirection: 'row', borderWidth: dark ? 0 : 1, borderColor: '#E0E0E0', borderRadius: 8, backgroundColor: dark ? '#0E2831' : '#FFF', padding: wp(2.8), marginTop: hp(3) }}>
                            <View style={{ borderRadius: 8, backgroundColor: colors.GREEN.secondary, height: hp(8.7), width: hp(8.7), justifyContent: 'center', alignItems: 'center' }}>
                                <WalletWhite width={wp(12)} />
                            </View>
                            <View style={{ paddingLeft: wp(1.89) }}>
                                <StyledText font='regular' size={20} color={dark ? '#FFF' : '#0A0A26'}>Paid by Wallet</StyledText>
                                <StyledText font='regular' size={14} color={dark ? '#FFF' : '#0A0A26'}>Transaction ID</StyledText>
                                <StyledText font='reglightular' size={12} color={dark ? '#FFF' : '#0A0A26'}>{get(chargingInfo, 'TransID', '-')}</StyledText>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', borderWidth: dark ? 0 : 1, borderColor: '#E0E0E0', borderRadius: 8, backgroundColor: dark ? '#0E2831' : '#FFF', padding: wp(2.8), marginTop: hp(3) }}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <StyledText font='regular' size={16} color={dark ? '#FFF' : '#0A0A26'}>Booked Units</StyledText>
                                <StyledText font='semiBold' size={18} color={dark ? '#FFF' : '#0A0A26'}>{parseFloat(get(chargingInfo, 'TargetEnergy', 0)).toFixed(2)}</StyledText>
                            </View>

                            <View style={{ height: '100%', width: 1, backgroundColor: dark ? colors.BLUEGREY.secondary : '#FAFAFA' }}></View>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <StyledText font='regular' size={16} color={dark ? '#FFF' : '#0A0A26'}>Charged Units</StyledText>
                                <StyledText font='semiBold' size={18} color={dark ? '#FFF' : '#0A0A26'}>{get(chargingInfo, 'FinalEnergy', 0)}</StyledText>
                            </View>
                        </View>

                    </View>
                </ScrollView>
            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Button label='Done' onPress={() => onChargingDetail()} />
            </View>

        </View>
    )
}

export default ChargingSuccess;