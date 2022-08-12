import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { RootContainer, StickyHeader } from 'components';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyledText, Button } from 'components';
import { SwipeButton } from '@arelstone/react-native-swipe-button';
import DropDownPicker from "react-native-dropdown-picker";
import { setVerifiedCharging } from 'reduxStore/actions/charging';
import { useSelector, useDispatch } from 'react-redux';
import { first, get, last } from 'lodash';
import UserService from "networkServices/UserService";
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';
import { showHUD, hideHUD } from "utils/loader";
import SegmentedControlTab from "react-native-segmented-control-tab";
import Toast from 'react-native-simple-toast';
import { warningPopUp } from 'utils/Common';

import Connector1 from 'assets/images/connector1.svg';
import Connector2 from 'assets/images/connector2.svg';
import Connector3 from 'assets/images/connector3.svg';
import Connector4 from 'assets/images/connector4.svg';

import LightConnector1 from 'assets/images/connector1-green.svg';
import LightConnector2 from 'assets/images/connector2-green.svg';
import LightConnector3 from 'assets/images/connector3-green.svg';
import LightConnector4 from 'assets/images/connector4-green.svg';

const initialAmountArray = [
    {
        "id": 1,
        "Amount": 100,
        "isSelected": false
    },
    {
        "id": 2,
        "Amount": 200,
        "isSelected": true
    },
    {
        "id": 3,
        "Amount": 300,
        "isSelected": false
    },
    {
        "id": 4,
        "Amount": 400,
        "isSelected": false
    }
]

const ChargingInitialization = (props) => {

    // Gets the current theme. Dark or light
    const { locationInfo, machineInfo } = props.route.params;

    const { dark } = useTheme();
    const dispatch = useDispatch();
    const { homeDetails } = useSelector((state) => state.home);
    const { loginInfo } = useSelector((state) => state.auth);
    const { notificationConfig } = useSelector((state) => state.notification);

    const walletBalance = get(notificationConfig, 'Wallet', 0);
    const [index, setIndex] = useState(0);
    const [tabIndex, setTabIndex] = useState(0)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [payAmount, setPayAmount] = useState('200');
    const [requireUnit, setRequireUnit] = useState();
    const [quickAmount, setQuickAmount] = useState(initialAmountArray);
    const [estimatedBenefit, setEstimatedBenefit] = useState(null);
    const [initiateChargeResponse, setInitiateChargeResponse] = useState(null);
    const [items, setItems] = useState([
        { label: '₹100', value: '₹100' },
        { label: '₹200', value: '₹200' }
    ]);

    let payAndReturnValue = null;

    const navToWallet = () => {
        const { navigate } = props.navigation;
        navigate('Wallet', { screen: 'Currency', params: { fromScreen: 'ChargingInitialization' } });
    }

    useEffect(() => {
    }, [])

    async function onConnectorSelection() {
        const { goBack } = props.navigation;
        const { locationInfo, machineInfo } = props.route.params;

        const Obj = [
            { name: "MachineId", data: get(machineInfo, 'MachineID', '') },
            { name: "LocationID", data: get(locationInfo, '_id', '') },
            { name: "ConnectorID", data: get(machineInfo, 'ConnectorID', '') }
        ];

        let isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const selectionData = await UserService.connectorSelection(loginInfo, Obj);
            hideHUD();
            if (isGetSuccessData(selectionData)) {
                setIndex(1);
            }
            else {
                apiFallBackAlert(selectionData, dark)
                setTimeout(() => {
                    goBack();
                }, 500);
            }
        }
        else {
            showInternetLostAlert(() => {
                onConnectorSelection()
            });
        }
    }

    async function onInitiateCharging(chargeFromUser) {
        const locationInfo = get(props, 'route.params.locationInfo', null);
        const machineInfo = get(props, 'route.params.machineInfo', null);
        // setIndex(2);

        let MachineID = get(machineInfo, 'MachineID', '');
        let LocationID = get(locationInfo, '_id', '');
        let ConnectorID = get(machineInfo, 'ConnectorID', '');


        const Obj = [
            { name: "MachineId", data: MachineID },
            { name: "LocationID", data: LocationID },
            { name: "ConnectorID", data: ConnectorID },
            { name: "valueType", data: tabIndex === 0 ? 'amount' : 'unit' },
            { name: "value", data: String(chargeFromUser).trim() },
        ];

        let isConnected = await checkInternet();
        if (isConnected) {
            if (MachineID == '' || ConnectorID == '') {
                warningPopUp("It seems like missing Machine Id or Connector Id.", dark)
                // alert("It seems like missing Machine Id or Connector Id.")
            } else {
                showHUD();
                const chargingFlowData = await UserService.initiateChargingFlow(loginInfo, Obj);
                hideHUD();
                if (isGetSuccessData(chargingFlowData)) {
                    setInitiateChargeResponse(get(chargingFlowData, 'data', null));
                    setIndex(2);
                }
                else {
                    apiFallBackAlert(chargingFlowData, dark)
                }
            }
        }
        else {
            showInternetLostAlert(() => {
                onProceedNext()
            });
        }
    }

    const calculateEstimatedBenefit = () => {
        const perMinAmount = get(payAndReturnValue, 'benefit', null);
        const machineCapacity = get(payAndReturnValue, 'price', null);
        const perMinCharge = parseFloat(first(String(perMinAmount).split('/')));
        const perHourCharge = 60 * perMinCharge;

        const capacityInWatt = parseFloat(first(String(machineCapacity).split('/')));
        const calculatePriceByUnit = ((requireUnit * perHourCharge) / capacityInWatt)
        const calculateUnitByPrice = ((payAmount * capacityInWatt) / perHourCharge)

        if (tabIndex == 0) {
            const payReceiveOverview = {
                estimatedPrice: payAmount,
                estimatedUnit: calculateUnitByPrice
            }

            const setPayReceiveOverview = {
                estimatedPrice: String(payAmount),
                estimatedUnit: String(calculateUnitByPrice)
            }

            setEstimatedBenefit(setPayReceiveOverview);
            return payReceiveOverview;
        } else if (tabIndex == 1) {
            const payReceiveOverview = {
                estimatedPrice: calculatePriceByUnit,
                estimatedUnit: requireUnit
            }

            const setPayReceiveOverview = {
                estimatedPrice: String(payAmount),
                estimatedUnit: String(calculateUnitByPrice)
            }

            setEstimatedBenefit(setPayReceiveOverview);
            return payReceiveOverview;
        }
    }

    async function onProceedNext() {
        const validatePayAmount = parseInt(payAmount)
        const validateWalletBalance = parseInt(walletBalance)

        if (tabIndex == 0) {
            if (validatePayAmount > validateWalletBalance) {
                // alert('You not have sufficient wallet balance to proceed next!!')
                warningPopUp("You not have sufficient wallet balance to proceed next!!", dark)
                return;
            } else {
                calculateEstimatedBenefit()
                onInitiateCharging(validatePayAmount)
            }
        } else if (tabIndex == 1) {
            // const calculatedBenefit = calculateEstimatedBenefit();
            // const calculatePriceByUnit = get(calculatedBenefit, 'estimatedPrice', null);
            const calculatePriceByUnit = requireUnit * get(locationInfo, 'priceperunit', 0)
            if (calculatePriceByUnit > validateWalletBalance) {
                const insufficientBalance = `Estimated price(${calculatePriceByUnit}) exceed your wallet balance, please add money in wallet to proceed!!`
                // alert(insufficientBalance)
                warningPopUp(insufficientBalance, dark)
            } else {
                onInitiateCharging(requireUnit)
            }
        }

    }

    async function onInitiation() {

        const { locationInfo, machineInfo } = props.route.params;

        let MachineID = get(machineInfo, 'MachineID', '');
        let LocationID = get(locationInfo, '_id', '');
        let ConnectorID = get(machineInfo, 'ConnectorID', '');

        const Obj = [
            { name: "MachineId", data: MachineID },
            { name: "LocationID", data: LocationID },
            { name: "ConnectorID", data: ConnectorID },
            { name: "targetPower", data: String(get(initiateChargeResponse, 'estimatedEnergy', null)) },
        ];

        // props.navigation.navigate('Charging', {
        //     locationInfo: locationInfo,
        //     machineInfo: machineInfo
        // })
        let isConnected = await checkInternet();
        if (isConnected) {
            if (MachineID == '' || ConnectorID == '') {
                // alert("It seems like missing Machine Id or Connector Id.")
                warningPopUp("It seems like missing Machine Id or Connector Id.", dark)
            } else {
                showHUD();
                console.log('--- Obj ---')
                console.log(Obj)
                const verifiedData = await UserService.verifyChargingInfo(loginInfo, Obj);
                hideHUD();
                if (isGetSuccessData(verifiedData)) {
                    dispatch(setVerifiedCharging(get(verifiedData, 'data', null)));
                    // setVerifiedCharging
                    props.navigation.navigate('Charging', {
                        locationInfo: locationInfo,
                        machineInfo: machineInfo,
                        targetPower: get(verifiedData, 'data.targetPower', ''),
                        totalAmount: get(verifiedData, 'data.totalAmount', ''),
                    })
                }
                else {
                    apiFallBackAlert(verifiedData, dark)
                }
            }
        }
        else {
            showInternetLostAlert(() => {
                onInitiation()
            });
        }
    }

    const onQuickSelectAmount = (selectedItem, selectedIndex) => {
        const updatedAmountArray = quickAmount.map((item, index) => {
            return selectedIndex === index ? { ...item, isSelected: !item.isSelected } : { ...item, isSelected: false }
        })

        setPayAmount(String(selectedItem.Amount))
        setQuickAmount(updatedAmountArray)
    }

    const priceAndReturnCalculator = (value, isPrice) => {
        const priceValue = String(first(String(value).split('-'))).trim();
        const validatePrice = String(last(String(priceValue).split(' '))).trim();

        const benefitValue = String(last(String(value).split('-'))).trim();
        payAndReturnValue = {
            price: validatePrice,
            benefit: benefitValue
        }

        if (isPrice) {
            return validatePrice
        } else {
            return benefitValue
        }
    }

    function onBackButtonPress() {
        if (index <= 0) {
            props.navigation.goBack()
        } else {
            setIndex(index - 1)
        }
    }

    function connectorImageByType(type) {
        if (dark) {
            switch (type) {
                case 1:
                    return <Connector1 />
                case 2:
                    return <Connector2 />
                case 3:
                    return <Connector3 />
                case 4:
                    return <Connector4 />

                default:
                    return <Connector1 />
            }
        } else {
            switch (type) {
                case 1:
                    return <LightConnector1 />
                case 2:
                    return <LightConnector2 />
                case 3:
                    return <LightConnector3 />
                case 4:
                    return <LightConnector4 />

                default:
                    return <LightConnector1 />
            }
        }
    }

    return (
        <RootContainer>
            <StickyHeader {...props} onBackButtonPress={() => onBackButtonPress()} headerTitle="Charge initialize" />
            <ScrollView style={{ backgroundColor: dark ? '#0E2831' : '#FFF' }} contentContainerStyle={{ flexGrow: 1, marginTop: 8 }}>
                <View style={{ alignItems: 'center', backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', paddingHorizontal: wp(2), paddingTop: hp(14), paddingBottom: hp(4) }}>
                    <StyledText style={{}} font='regular' size={32} color={dark ? '#FFF' : '#0A0A26'}>{get(locationInfo, 'LocationName', '')}</StyledText>
                    <StyledText style={{ marginTop: hp(1), textAlign: 'center' }} font='regular' size={14} color={dark ? '#FFF' : '#0A0A26'}>{get(locationInfo, 'Address', '')}</StyledText>
                    <View style={[globalStyle.absoluteContainer, { alignItems: 'center' }]}>
                        <Image source={require('../../../assets/icons/zap.png')} />
                    </View>
                    <View style={[globalStyle.rowContainer, { borderRadius: 6, backgroundColor: colors.GREEN.secondary, height: hp(11.2), marginTop: hp(8) }]}>
                        <View style={[globalStyle.rowContainerCentered, { flex: 0.6, height: '100%', paddingLeft: 12 }]}>
                            {/* <Image source={require('../../../assets/icons/cs2-2.png')} /> */}
                            {connectorImageByType(get(machineInfo, 'MachineConnectorNo', 1))}
                            <StyledText style={{ marginLeft: 12 }} font='regular' size={14} color={'#FFF'}>{get(machineInfo, 'VehicleConnectorName', '')}{'\n'}Capacity :{priceAndReturnCalculator(get(machineInfo, 'VehicleConnectorText', '-'), true)}</StyledText>
                        </View>
                        <View style={{ height: '100%', width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                        <View style={[globalStyle.centeredContent, { flex: 0.4, height: '100%', paddingLeft: 12 }]}>
                            <StyledText style={{ textAlign: 'center' }} font='black' size={20} color={'#FFF'}>₹ {priceAndReturnCalculator(get(machineInfo, 'VehicleConnectorText', '-'), false)}</StyledText>
                            <StyledText style={{ textAlign: 'center' }} font='regular' size={12} color={'#FFF'}>(Estimated*)</StyledText>
                        </View>
                    </View>
                    <StyledText style={{ marginTop: hp(2) }} font='regular' size={16} color={dark ? '#FFF' : '#0A0A26'}>{get(machineInfo, 'MachineTitle', '')} | {get(machineInfo, 'MachineConnectorNo', '')}</StyledText>
                </View>

                {
                    index === 0 ?
                        <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: wp(5), paddingBottom: hp(5) }}>
                            <SwipeButton
                                height={61}
                                titleStyle={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.extraBig, color: dark ? '#FFF' : '#000' }}
                                containerStyle={{ backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', overflow: 'hidden' }}
                                underlayStyle={{ backgroundColor: colors.GREEN.secondary }}
                                circleBackgroundColor="#FFF"
                                Icon={<Feather name='chevron-right' size={24} color={'#000'} />}
                                onComplete={() => { setIndex(1) }}
                                // onComplete={() => onConnectorSelection()}
                                title="Slide to initiate"
                            />
                        </View>
                        :
                        index === 1 ?
                            <View style={{ flex: 1, paddingHorizontal: wp(5), paddingBottom: hp(5), paddingTop: hp(3) }}>
                                <View style={[globalStyle.rowContainerCenteredSpaced, { borderWidth: 1, borderColor: dark ? colors.GREEN.secondary : '#E0E0E0', paddingHorizontal: 12, paddingVertical: 16, borderRadius: 6 }]}>
                                    <View style={[globalStyle.rowContainerCentered, {}]}>
                                        <Image source={dark ? require('../../../assets/icons/wallet.png') : require('../../../assets/icons/wallet-green.png')} />
                                        <View style={{ paddingLeft: 12 }}>
                                            <StyledText font='light' size={14} color={dark ? '#FFF' : '#0A0A26'}>Wallet Balance</StyledText>
                                            <StyledText font='bold' size={24} color={colors.GREEN.secondary}>₹{walletBalance}</StyledText>
                                        </View>
                                    </View>
                                    <View>
                                        <Button label='Add Topup' onPress={() => navToWallet()} />
                                    </View>
                                    {/* <Feather name='chevron-down' size={24} color={'rgba(255,255,255,0.5)'} /> */}
                                </View>
                                <StyledText style={{ marginVertical: hp(2) }} font='regular' size={22} color={dark ? '#FFF' : '#0A0A26'}>Charging Basis</StyledText>
                                {/* <View style={[globalStyle.rowContainer, { backgroundColor: dark ? undefined : '#EFEFEF', borderRadius: 50, borderWidth: 1, borderColor: colors.GREEN.secondary, overflow: 'hidden', height: hp(5.4) }]}> */}
                                {/* <View style={[globalStyle.centeredContent, { flex: 1, backgroundColor: colors.GREEN.secondary }]}>
                                    <StyledText font='bold' size={16} color='#FFF'>₹ Amount</StyledText>
                                </View>
                                <View style={[globalStyle.centeredContent, { flex: 1 }]}>
                                    <StyledText font='bold' size={16} color={dark ? '#FFF' : '#0A0A26'}>₹ Units</StyledText>
                                </View> */}
                                <SegmentedControlTab
                                    values={["Amount", "Units"]}
                                    selectedIndex={tabIndex}
                                    borderRadius={20}
                                    tabTextStyle={{ color: dark ? '#FFF' : '#000' }}
                                    tabStyle={[globalStyle.centeredContent, { flex: 1, backgroundColor: 'transparent', fontSize: 16, fontWeight: 'bold', borderColor: 'transparent' }]}
                                    activeTabStyle={[globalStyle.centeredContent, { flex: 1, backgroundColor: colors.GREEN.secondary, color: '#FFF', fontSize: 16, fontWeight: 'bold' }]}
                                    tabsContainerStyle={[globalStyle.rowContainer, { backgroundColor: dark ? undefined : '#EFEFEF', borderRadius: 50, borderWidth: 1, borderColor: colors.GREEN.secondary, overflow: 'hidden', height: hp(5.4) }]}
                                    onTabPress={() => setTabIndex(tabIndex == 0 ? 1 : 0)}
                                />
                                {/* </View> */}
                                {tabIndex == 0 ?

                                    <View>
                                        <View style={[globalStyle.rowContainer, { backgroundColor: dark ? undefined : '#EFEFEF', borderRadius: 50, borderWidth: 1, borderColor: colors.GREEN.secondary, overflow: 'hidden', height: hp(5.4), marginTop: hp(3) }]}>
                                            <View style={[globalStyle.centeredContent, { paddingHorizontal: 28, backgroundColor: colors.GREEN.secondary }]}>
                                                <StyledText font='bold' size={30} color='#FFF'>₹</StyledText>
                                            </View>
                                            <View style={[{ flex: 1, justifyContent: 'center', paddingLeft: 4 }]}>
                                                <TextInput
                                                    value={payAmount}
                                                    onChangeText={(input) => setPayAmount(input)}
                                                    placeholder="Enter custom amount"
                                                    keyboardType="number-pad"
                                                    placeholderTextColor={dark ? 'rgba(255,255,255,0.4)' : 'rgba(10, 10, 38,0.4)'}
                                                    style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.big, color: dark ? 'rgb(255,255,255)' : 'rgb(10, 10, 38)' }} />
                                            </View>
                                        </View>

                                        <View style={[globalStyle.rowContainerCenteredSpaced, { marginTop: hp(3) }]}>
                                            {quickAmount.map((item, index) => {
                                                return (
                                                    <TouchableOpacity key={index.toString()} onPress={() => onQuickSelectAmount(item, index)} activeOpacity={0.7} style={[globalStyle.centeredContent, {
                                                        height: wp(17.5), width: wp(17.5), borderRadius: 8, borderWidth: 1,
                                                        borderColor: item.isSelected ? colors.GREEN.secondary : dark ? 'rgba(255,255,255,0.4)' : '#E0E0E0',
                                                        backgroundColor: item.isSelected ? colors.GREEN.secondary : dark ? '#003946' : '#FFF'
                                                    }]}>
                                                        <StyledText font='regular' size={20} color={dark ? '#FFF' : '#0A0A26'}>₹{get(item, 'Amount', 100)}</StyledText>
                                                    </TouchableOpacity>
                                                )
                                            })}

                                            {/* <View style={[globalStyle.centeredContent, { height: wp(17.5), width: wp(17.5), borderRadius: 8, borderWidth: 1, borderColor: colors.GREEN.secondary, backgroundColor: colors.GREEN.secondary }]}>
                                            <StyledText font='regular' size={20}>₹100</StyledText>
                                        </View>
                                        <View style={[globalStyle.centeredContent, { height: wp(17.5), width: wp(17.5), borderRadius: 8, borderWidth: 1, borderColor: dark ? 'rgba(255,255,255,0.4)' : '#E0E0E0', backgroundColor: dark ? '#003946' : '#FFF' }]}>
                                            <StyledText font='regular' size={20} color={dark ? '#FFF' : '#0A0A26'}>₹200</StyledText>
                                        </View>
                                        <View style={[globalStyle.centeredContent, { height: wp(17.5), width: wp(17.5), borderRadius: 8, borderWidth: 1, borderColor: dark ? 'rgba(255,255,255,0.4)' : '#E0E0E0', backgroundColor: dark ? '#003946' : '#FFF' }]}>
                                            <StyledText font='regular' size={20} color={dark ? '#FFF' : '#0A0A26'}>₹300</StyledText>
                                        </View>
                                        <View style={[globalStyle.centeredContent, { height: wp(17.5), width: wp(17.5), borderRadius: 8, borderWidth: 1, borderColor: dark ? 'rgba(255,255,255,0.4)' : '#E0E0E0', backgroundColor: dark ? '#003946' : '#FFF' }]}>
                                            <StyledText font='regular' size={20} color={dark ? '#FFF' : '#0A0A26'}>₹400</StyledText>
                                        </View> */}
                                        </View>
                                    </View>
                                    :
                                    <View>
                                        <View style={[globalStyle.rowContainer, { backgroundColor: dark ? undefined : '#EFEFEF', borderRadius: 50, borderWidth: 1, borderColor: colors.GREEN.secondary, overflow: 'hidden', height: hp(5.4), marginTop: hp(3) }]}>
                                            <View style={[globalStyle.centeredContent, { paddingHorizontal: 28, backgroundColor: colors.GREEN.secondary }]}>
                                                <Feather
                                                    name="zap"
                                                    size={20}
                                                    color={'#FFF'}
                                                />
                                            </View>
                                            <View style={[{ flex: 1, justifyContent: 'center', paddingLeft: 4 }]}>
                                                <TextInput
                                                    value={requireUnit}
                                                    onChangeText={(input) => setRequireUnit(input)}
                                                    placeholder="Enter units"
                                                    keyboardType="number-pad"
                                                    placeholderTextColor={dark ? 'rgba(255,255,255,0.4)' : 'rgba(10, 10, 38,0.4)'}
                                                    style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.big, color: dark ? 'rgb(255,255,255)' : 'rgb(10, 10, 38)' }} />
                                            </View>
                                        </View>
                                    </View>
                                }

                                <View style={{ marginTop: hp(2) }}>
                                    <Button label='Proceed to next' onPress={() => onProceedNext()} />
                                </View>

                            </View>
                            :
                            <View style={{ flex: 1, paddingBottom: hp(5), paddingTop: hp(3), paddingHorizontal: wp(5) }}>
                                {/* <DropDownPicker
                                    style={{ backgroundColor: dark ? '#0E2831' : '#FFF', borderRadius: open ? 15 : 50, borderColor: dark ? colors.GREEN.secondary : '#E0E0E0' }}
                                    textStyle={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.regular, color: dark ? '#FFF' : '#0A0A26' }}
                                    dropDownContainerStyle={{ backgroundColor: dark ? '#0E2831' : '#FFF', borderColor: dark ? colors.GREEN.secondary : '#E0E0E0' }}
                                    ArrowUpIconComponent={({ style }) => <View />}
                                    ArrowDownIconComponent={() => value == null ? <Feather name='chevron-down' size={24} color={dark ? 'rgba(255,255,255,0.5)' : '#0A0A26'} /> : <StyledText style={{ marginRight: wp(10) }} font='bold' size={14} color={dark ? '#FFF' : '#0A0A26'}>{value}</StyledText>}
                                    placeholder='Estimated Amount'
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                /> */}

                                <View style={[globalStyle.rowContainerCenteredSpaced, { borderRadius: 50, borderWidth: 1, borderColor: dark ? colors.GREEN.secondary : '#E0E0E0', height: hp(6.3), paddingLeft: wp(3), paddingRight: wp(5), marginTop: hp(3) }]}>
                                    <StyledText font='light' size={14} color={dark ? '#FFF' : '#0A0A26'}>Estimated Amount</StyledText>
                                    <StyledText font='light' size={14} color={dark ? '#FFF' : '#0A0A26'}>₹ {get(initiateChargeResponse, 'totalAmount', null)}</StyledText>
                                </View>

                                <View style={[globalStyle.rowContainerCenteredSpaced, { borderRadius: 50, borderWidth: 1, borderColor: dark ? colors.GREEN.secondary : '#E0E0E0', height: hp(6.3), paddingLeft: wp(3), paddingRight: wp(5), marginTop: hp(3) }]}>
                                    <StyledText font='light' size={14} color={dark ? '#FFF' : '#0A0A26'}>Estimated Units</StyledText>
                                    <StyledText font='light' size={14} color={dark ? '#FFF' : '#0A0A26'}>{parseFloat(get(initiateChargeResponse, 'estimatedEnergy', null)).toFixed(2)} kWh</StyledText>
                                </View>

                                <StyledText font='light' size={13} style={{ textAlign: 'center', marginTop: hp(2.5) }} color={dark ? '#FFF' : '#0A0A26'}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</StyledText>

                                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                    <SwipeButton
                                        height={61}
                                        titleStyle={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.extraBig, color: dark ? '#FFF' : '#000' }}
                                        containerStyle={{ backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', overflow: 'hidden' }}
                                        underlayStyle={{ backgroundColor: colors.GREEN.secondary }}
                                        circleBackgroundColor="#FFF"
                                        Icon={<Feather name='chevron-right' size={24} color={'#000'} />}
                                        onComplete={() => onInitiation()}
                                        title="Slide to initiate"
                                    />
                                </View>

                            </View>
                }


            </ScrollView>
        </RootContainer>
    )
}

export default ChargingInitialization;