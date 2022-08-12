import { useTheme } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import { Image, StyleSheet, View, Dimensions, BackHandler } from "react-native";
import { colors, globalStyle, fonts } from 'styleConfig';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Button, StyledText, TimerComponent, StickyHeader } from 'components';
import ZapCircle from '../../../assets/images/zap-circle.svg';
import CarCharging from '../../../assets/images/car-charging.svg';
import Connector1 from '../../../assets/images/connector1.svg';
import ClockLight from '../../../assets/icons/clock-light.svg';
import ClockGreen from '../../../assets/icons/clock-green.svg';
import ZapLight from '../../../assets/icons/zap-light.svg';
import ZapGreen from '../../../assets/icons/zap-green.svg';
import DashboardLight from '../../../assets/icons/dashboard-light.svg';
import DashboardGreen from '../../../assets/icons/dashboard-green.svg';
import ConnectChargerDark from '../../../assets/icons/connect-charger-dark.svg';
import ConnectChargerLight from '../../../assets/icons/connect-charger-light.svg';
import DisConnectChargerLight from '../../../assets/images/connect-unable-light.svg';
import DisConnectChargerDark from '../../../assets/images/connect-unable-dark.svg';
import DisConnect from '../../../assets/images/connector_disconnect.svg';
import ConnectionEstablished from '../../../assets/icons/connection-established.svg';
import { useSelector, useDispatch } from 'react-redux';
import { resetChargingRedux, setChargingOnStart, markAsCompleteCharge } from 'reduxStore/actions/charging';
import { first, get, isArray } from 'lodash';
import UserService from "networkServices/UserService";
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';
import { showHUD, hideHUD } from "utils/loader";
import { msToHMS } from 'utils/Common';
import { Timer, Countdown } from 'react-native-element-timer';
import { createAnimatableComponent } from 'react-native-animatable';
import { warningPopUp, chargingSyncBufferTime } from 'utils/Common';

import zapBlurIcon from 'assets/images/zap_blur.png';
import moment from "moment";

const AnimatableImage = createAnimatableComponent(Image);

const pulse = {
    0: {
        scale: 0.9,
    },
    0.5: {
        scale: 1
    },
    1: {
        scale: 0.9
    }
}

// let syncInterval = null;
const { height, width } = Dimensions.get('screen');
const scale = width / 428;

const Charging = (props) => {

    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const dispatch = useDispatch();
    let syncInterval = useRef(null);
    const timerRef = useRef(null);
    const [connection, setConnection] = useState(false);
    const [index, setIndex] = useState(0)
    const { loginInfo } = useSelector((state) => state.auth);
    const { connectorInfo, verifiedCharging, startChargingInfo } = useSelector((state) => state.charging);
    const [chargingData, setchargingData] = useState(null);
    const [isConnectionFail, setIsConnectionFail] = useState(false)
    const [syncChargeData, setSyncChargeData] = useState(null);
    const [isAutoStop, setIsAutoStop] = useState(false);
    const [isSyncBufferOver, setSyncBufferOver] = useState(false);


    useEffect(() => {
        onResumeCharging();
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
        };
    }, [])

    function handleBackButtonClick() {
        if (index === 2) {
            const { navigate } = props.navigation;
            navigate('Home');
            return true;
        } else {
            return true;
        }
    }

    function onResumeCharging() {
        const fromScreen = props.route?.params?.fromScreen;
        if (fromScreen === 'Home') {
            setIndex(2)
            setSyncBufferOver(true)
            onSyncChargingData(startChargingInfo);
        }
    }

    function onSyncChargingData(chargingInfo) {
        if (timerRef.current) {
            timerRef.current.start();
        }
        syncChargingData(chargingInfo);
        syncInterval.current = setInterval(() => {
            syncChargingData(chargingInfo);
        }, 10000);
    }


    async function onConnectorLocking() {

        const { locationInfo, machineInfo } = props.route.params;

        let MachineID = get(machineInfo, 'MachineID', '');
        let LocationID = get(locationInfo, '_id', '');
        let ConnectorID = get(machineInfo, 'ConnectorID', '');

        const Obj = [
            { name: "MachineId", data: MachineID },
            { name: "LocationID", data: LocationID },
            { name: "ConnectorID", data: ConnectorID },
        ];

        let isConnected = await checkInternet();
        if (isConnected) {
            if (MachineID == '' || ConnectorID == '') {
                // alert("It seems like missing Machine Id or Connector Id.")
                warningPopUp("It seems like missing Machine Id or Connector Id.", dark)
            } else {
                showHUD();
                const connectorLocData = await UserService.connectorLocking(loginInfo, Obj);
                hideHUD();
                if (isGetSuccessData(connectorLocData)) {
                    setIsConnectionFail(false);
                    setIndex(1);
                }
                else {
                    // const isAlreadyInCharge = String(get(connectorLocData, 'message', '')).includes('Gun is already connected with userID') ||
                    //     String(get(connectorLocData, 'message', '')).includes('Machine with This GunId is in charging')
                    // if (isAlreadyInCharge) {
                    //     setIsConnectionFail(false);
                    //     setIndex(1);
                    // } else {
                    apiFallBackAlert(connectorLocData, dark);
                    setIsConnectionFail(true);
                    // }
                }
            }
        }
        else {
            showInternetLostAlert(() => {
                onConnectorLocking()
            });
        }
    }

    async function onStartCharging() {

        const { locationInfo, machineInfo, targetPower } = props.route.params;
        // setIndex(2);
        // onSyncChargingData();

        let MachineID = get(machineInfo, 'MachineID', '');
        let LocationID = get(locationInfo, '_id', '');
        let ConnectorID = get(machineInfo, 'ConnectorID', '');

        const Obj = [
            { name: "MachineId", data: MachineID },
            { name: "LocationID", data: LocationID },
            { name: "ConnectorID", data: ConnectorID },
            // { name: "TotalTime", data: 5678 },
            { name: "TargetEnergy", data: String(targetPower) },
        ];

        let isConnected = await checkInternet();
        if (isConnected) {
            if (MachineID == '' || ConnectorID == '') {
                // alert("It seems like missing Machine Id or Connector Id.")
                warningPopUp("It seems like missing Machine Id or Connector Id.", dark)
            } else {
                showHUD();
                const startChargingData = await UserService.startCharging(loginInfo, Obj);
                hideHUD();
                if (isGetSuccessData(startChargingData)) {
                    const responseData = get(startChargingData, 'data', []);
                    const data = isArray(responseData) ? first(responseData) : responseData;
                    dispatch(setChargingOnStart(data))
                    setchargingData(data)
                    setIndex(2);
                    showHUD('Please wait while we are fetching data')
                    setTimeout(() => {
                        hideHUD();
                        setSyncBufferOver(true)
                        onSyncChargingData(data);
                    }, chargingSyncBufferTime);
                }
                else {
                    // if (String(get(startChargingData, 'message', '')).includes('The machine is already in charging')) {
                    //     const responseData = get(startChargingData, 'data', []);
                    //     const data = isArray(responseData) ? first(responseData) : responseData;
                    //     dispatch(setChargingOnStart(data))
                    //     setchargingData(data)
                    //     setIndex(2);
                    //     showHUD('Please wait while we are fetching data')
                    //     setTimeout(() => {
                    //         hideHUD();
                    //         setSyncBufferOver(true);
                    //         onSyncChargingData(data);
                    //     }, chargingSyncBufferTime);
                    //     // onSyncChargingData();
                    // } else {
                    apiFallBackAlert(startChargingData, dark)
                    setIndex(0);
                    setIsConnectionFail(true);
                    // }
                }
            }
        }
        else {
            showInternetLostAlert(() => {
                onStartCharging()
            });
        }
    }

    async function onStopCharging() {

        const Obj = [
            { name: "ChargingSessionId", data: String(get(startChargingInfo, 'ChargingSessionId', '')) },
        ];

        let isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            if (syncInterval) {
                clearInterval(syncInterval.current);
            }
            const stopChargingData = await UserService.stopCharging(loginInfo, Obj);
            hideHUD();
            if (isGetSuccessData(stopChargingData)) {
                if (timerRef.current) {
                    timerRef.current.stop();
                }
                props.navigation.navigate('ChargingSuccess', {
                    chargingInfo: get(stopChargingData, 'data', '')
                })
            }
            else {
                apiFallBackAlert(stopChargingData, dark)
            }
        }
        else {
            showInternetLostAlert(() => {
                onStopCharging()
            });
        }
    }

    async function onAutoStop(syncDataObj) {
        if (syncInterval) {
            clearInterval(syncInterval.current);
        }

        // const stopChargingData = {
        //     StartTime: get(syncDataObj, 'chargedDetails.StartTime', null),
        //     TotalTime: get(syncDataObj, 'TotalTime', null),
        //     TransID: '',
        //     ...syncDataObj
        // }
        const stopChargingData = {
            "LocationID": get(syncDataObj, 'chargedDetails.LocationId', ''),
            "FinalEnergy": get(syncDataObj, 'chargedDetails.FinalEnergy', 0),
            "StartTime": get(syncDataObj, 'chargedDetails.StartTime', 0),
            "TotalTime": get(syncDataObj, 'chargedDetails.TotalDuration', 0),
            "TransID": get(syncDataObj, 'chargedDetails.TransID', 0),
            "TotalAmount": get(syncDataObj, 'chargedDetails.TotalPayment', 0),
            "TargetEnergy": get(syncDataObj, 'TargetEnergy', 0),
            "FinalEnergy": get(syncDataObj, 'chargedDetails.FinalEnergy', 0)
        }
        props.navigation.navigate('ChargingSuccess', {
            chargingInfo: stopChargingData
        })
    }

    async function syncChargingData(chargingInfo) {

        const { locationInfo, machineInfo } = props.route.params;

        const Obj = [
            { name: "ChargingSessionId", data: String(get(chargingInfo, 'ChargingSessionId', '')) },
        ];


        let isConnected = await checkInternet();
        if (isConnected) {
            if (!isAutoStop) {
                const syncData = await UserService.syncChargingDetails(loginInfo, Obj);
                if (isGetSuccessData(syncData)) {
                    const syncDataObj = get(syncData, 'data', null);
                    setSyncChargeData(syncDataObj);
                    if (syncDataObj) {
                        const isCharged = get(syncDataObj, 'chargedCompleted', null);
                        if (isCharged) {
                            setIsAutoStop(true)
                            onAutoStop(syncDataObj)
                            return;
                        }
                    }
                }
                else {
                    apiFallBackAlert(syncData, dark);
                }
            }
        }
        else {
            showInternetLostAlert(() => {
                syncChargingData(chargingInfo)
            });
        }
    }

    function onBackButtonPress() {
        if (index == 2) {
            props.navigation.navigate('Tabs', { screen: 'Home', params: { screen: 'Home' } });
        } else if (index <= 0) {
            props.navigation.goBack()
        } else {
            setIndex(index - 1)
        }
    }

    return (
        <View style={{ flexGrow: 1 }}>
            <StickyHeader {...props} onBackButtonPress={() => onBackButtonPress()} headerTitle="Charging" />
            <View style={{ flex: 1, backgroundColor: dark ? '#0E2831' : '#FFF', paddingTop: index === 2 ? hp(6.5) : hp(10), paddingBottom: hp(4), paddingHorizontal: wp(5) }}>
                {
                    index === 0 &&
                    <View style={{ flex: 1 }}>
                        <View style={[globalStyle.rowContainerCentered, { justifyContent: 'center' }]}>
                            {
                                dark ?
                                    isConnectionFail ?
                                        <DisConnectChargerDark />
                                        :
                                        <ConnectChargerLight />
                                    :
                                    isConnectionFail ?
                                        <DisConnectChargerLight />
                                        :
                                        <ConnectChargerDark />
                            }
                        </View>
                        <StyledText style={{ textAlign: 'center', marginTop: hp(5) }} size={20} font='regular'>Connect the charging cable to vehicle</StyledText>

                        <View style={{ alignItems: 'center', marginTop: hp(4) }}>
                            <View style={[globalStyle.centeredContent, { borderRadius: 50, backgroundColor: isConnectionFail ? colors.RED.primary : colors.GREEN.secondary, height: wp(15.2), width: wp(15.2) }]}>
                                {/* {isConnectionFail ?
                                <DisConnect width={'70%'} />
                                : */}
                                <Connector1 width={'70%'} />
                                {/* } */}
                            </View>
                            <View style={{ width: 1, height: '40%', backgroundColor: isConnectionFail ? colors.RED.primary : colors.GREEN.secondary }} />
                            <View style={[globalStyle.centeredContent, { borderRadius: 50, backgroundColor: isConnectionFail ? colors.RED.primary : colors.GREEN.secondary, height: wp(4.9), width: wp(4.9) }]} />
                        </View>

                        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <CarCharging width={'100%'} />
                            <Button style={{ marginTop: hp(3) }} label='Connect and next' onPress={() => onConnectorLocking()} />
                        </View>
                    </View>

                }
                {
                    index === 1 &&
                    <View style={{ flex: 1 }}>
                        <View style={[globalStyle.rowContainerCentered, { justifyContent: 'center' }]}>
                            <ConnectionEstablished />
                        </View>
                        <StyledText style={{ textAlign: 'center', marginTop: hp(5) }} size={16} font='regular' color={dark ? '#FFF' : '#0A0A26'}>Start charging, the connection is successfully established between car and with charger</StyledText>

                        <View style={{ alignItems: 'center', marginTop: hp(4) }}>
                            <View style={[globalStyle.centeredContent, { borderRadius: 50, backgroundColor: colors.GREEN.secondary, height: wp(15.2), width: wp(15.2) }]}>
                                <Connector1 width={'70%'} />
                            </View>
                            <View style={{ width: 1, height: '30%', backgroundColor: colors.GREEN.secondary }} />
                            <Image source={require('../../../assets/images/vertical-car.png')} />
                            {/* <VerticalCar /> */}
                        </View>

                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <Button style={{ marginTop: hp(3) }} label='Start Charging' onPress={() => onStartCharging()} />
                        </View>

                    </View>
                }
                {
                    index === 2 &&
                    <View style={{ flex: 1, paddingTop: 0 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.zapOutLine}>
                                <AnimatableImage duration={0} animation={pulse} easing="ease-out" iterationCount="infinite"
                                    source={zapBlurIcon}
                                    style={styles.zapIcon}
                                />
                            </View>

                        </View>

                        <View style={[{ borderWidth: dark ? 0 : 1, borderColor: '#E0E0E0', borderRadius: 8, justifyContent: 'flex-end', justifyContent: 'center', alignItems: 'center', backgroundColor: dark ? 'rgba(0, 57, 70,0.3)' : '#FFF', paddingVertical: hp(3), marginTop: hp(3) }]}>
                            <StyledText font='medium' color={colors.GREEN.secondary} size={32}>Charging</StyledText>
                            <StyledText style={{ marginTop: hp(0.5) }} font='light' size={16} color={dark ? '#FFF' : '#0A0A26'}>{get(connectorInfo, 'VehicleConnectorName', '')}</StyledText>
                        </View>

                        <View style={[globalStyle.rowContainerCenteredSpaced, { marginTop: hp(5), paddingHorizontal: wp(2), paddingBottom: hp(4) }]}>
                            <View style={[globalStyle.centeredContent, {}]}>
                                {
                                    dark ?
                                        <ClockLight />
                                        :
                                        <ClockGreen />
                                }
                                {/* {isSyncBufferOver ? */}
                                <Timer
                                    ref={timerRef}
                                    style={styles.timer}
                                    autoStart={true}
                                    textStyle={[styles.timerText, { color: dark ? '#FFF' : '#0A0A26' }]}
                                    onTimes={e => { }}
                                    onPause={e => { }}
                                    onEnd={e => { }}
                                    formatTime={'hh:mm:ss'}
                                    initialSeconds={get(syncChargeData, 'ElapsedTime', 0)}
                                // initialSeconds={moment(get(syncChargeData, 'StartTime', 0)).format('HH:MM:SS')}
                                // initialSeconds={parseInt(get(syncChargeData, 'ElapsedTime', 0) / 1000)}
                                />
                                {/* <StyledText style={{ marginTop: 4 }} font='light' size={18} color={dark ? '#FFF' : '#0A0A26'}>{msToHMS(0)}</StyledText> */}
                                {/* } */}

                                <StyledText font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>Time elapsed</StyledText>
                            </View>
                            <View style={[globalStyle.centeredContent, {}]}>
                                {
                                    dark ?
                                        <ZapLight />
                                        :
                                        <ZapGreen />
                                }
                                <StyledText style={{ marginTop: 4 }} font='light' size={18} color={dark ? '#FFF' : '#0A0A26'}>{parseFloat(get(syncChargeData, 'CurrentEnergy', 0)).toFixed(2)} Kwh</StyledText>
                                <StyledText font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>Energy</StyledText>
                            </View>
                            <View style={[globalStyle.centeredContent, {}]}>
                                {
                                    dark ?
                                        <DashboardLight />
                                        :
                                        <DashboardGreen />
                                }
                                <StyledText style={{ marginTop: 4 }} font='light' size={18} color={dark ? '#FFF' : '#0A0A26'}>{parseFloat(get(syncChargeData, 'OperatingPower', 0) || 0).toFixed(2)}KW</StyledText>
                                <StyledText font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>Power</StyledText>
                            </View>
                        </View>

                        <View style={{ width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />

                        <View style={{ marginTop: hp(2) }}>
                            <View style={[globalStyle.rowContainerCenteredSpaced]}>
                                <StyledText font='medium' size={16} color={dark ? '#FFF' : '#0A0A26'}>Charging Fee</StyledText>
                                <StyledText font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>₹ {parseFloat(get(verifiedCharging, 'totalAmount', 0).toFixed(2))}</StyledText>
                            </View>
                            <View style={[globalStyle.rowContainerCenteredSpaced, { marginVertical: hp(1) }]}>
                                <StyledText font='medium' size={16} color={dark ? '#FFF' : '#0A0A26'}>Idle Fee</StyledText>
                                <StyledText font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>00.00</StyledText>
                            </View>
                            <View style={[globalStyle.rowContainerCenteredSpaced]}>
                                <StyledText font='medium' size={16} color={dark ? '#FFF' : '#0A0A26'}>Total</StyledText>
                                <StyledText font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>₹ {parseFloat(get(verifiedCharging, 'totalAmount', 0).toFixed(2))}</StyledText>
                            </View>
                        </View>

                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <Button style={{ marginTop: hp(3) }} label='Stop Charging' onPress={() => onStopCharging()} />
                        </View>
                    </View>
                }

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    timer: {
        marginTop: 4
    },
    timerText: {
        fontFamily: fonts.MULISH.light,
        fontSize: 18 * scale,
    },
    centerContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    zapIcon: {
        height: wp('38%'),
        width: wp('38%'),
        resizeMode: 'contain'
    },
    zapOutLine: {
        height: wp('42%'),
        width: wp('42%'),
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: wp('21%'),
        borderWidth: wp('3.5%'),
        borderColor: '#19E024',
        alignItems: 'center',
        justifyContent: 'center'
    },
    blurAbsolute: {
        position: "absolute",
        height: wp('24%'),
        width: wp('24%'),
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: wp('17%')
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        alignSelf: 'center',
        justifyContent: 'center',
    }
})

export default Charging;