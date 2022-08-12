import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, SafeAreaView, Text, TextInput, TouchableWithoutFeedback, View, Alert, ScrollView, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';
import SvgUri from 'react-native-svg-uri';
import { Button, StyledText, StickyHeader } from 'components';
// import VoltLight from '../../assets/images/voltpanda2-light.svg';
import VoltLight from '../../../assets/images/voltpanda2-light.svg';
import Plant from '../../../assets/images/plant.svg';
import Charging from '../../../assets/images/charging.svg';
import ZapCar from '../../../assets/images/zap-car.svg';
import TeslaDark from '../../../assets/images/tesla-dark.svg';
import TeslaLight from '../../../assets/images/tesla-light.svg';
import JaguarDark from '../../../assets/images/jaguar-dark.svg';
import JaguarLight from '../../../assets/images/jaguar-light.svg';
import AudiDark from '../../../assets/images/audi-dark.svg';
import AudiLight from '../../../assets/images/audi-light.svg';
import TataDark from '../../../assets/images/tata-dark.svg';
import TataLight from '../../../assets/images/tata-light.svg';
import MahindraDark from '../../../assets/images/mahindra-dark.svg';
import MahindraLight from '../../../assets/images/mahindra-light.svg';
import MercedesDark from '../../../assets/images/mercedes-dark.svg';
import MercedesLight from '../../../assets/images/mercedes-light.svg';
import TeslaCircleDark from '../../../assets/images/tesla-circle-dark.svg';
import TeslaCircleRed from '../../../assets/images/tesla-circle-red.svg'
import DropDownPicker from "react-native-dropdown-picker";
import UserService from "networkServices/UserService";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';
import { get, map, flatten } from 'lodash';
import { saveUserVehicles } from 'reduxStore/actions/auth';
import { showHUD, hideHUD } from 'utils/loader';

import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-simple-toast';
import { warningPopUp } from 'utils/Common';

const { height, width } = Dimensions.get('screen');

const brands = [
    {
        image: {
            dark: <TeslaLight width={'90%'} />,
            light: <TeslaDark width={'90%'} />
        },
        key: 1
    },
    {
        image: {
            dark: <JaguarLight width={'90%'} />,
            light: <JaguarDark width={'90%'} />,
        },
        key: 2
    },
    {
        image: {
            dark: <AudiLight width={'90%'} />,
            light: <AudiDark width={'90%'} />
        },
        key: 3
    },
    {
        image: {
            dark: <TataLight width={'90%'} />,
            light: <TataDark width={'90%'} />
        },
        key: 4
    },
    {
        image: {
            dark: <MahindraLight width={'90%'} />,
            light: <MahindraDark width={'90%'} />
        },
        key: 5
    },
    {
        image: {
            dark: <MercedesLight width={'90%'} />,
            light: <MercedesDark width={'90%'} />
        },
        key: 6
    },
]


const AddVehicle = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const dispatch = useDispatch();

    const { loginInfo, deviceFCMToken } = useSelector((state) => state.auth);

    const [index, setIndex] = useState(0);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    // const [items, setItems] = useState([
    //     { label: 'Modal Y', value: 'modal_y' },
    //     { label: 'Model X', value: 'modal_x' }
    // ]);
    const [brand, setBrand] = useState([])
    const [modelData, setModelData] = useState([])
    const [registrationNo, setRegistrationNo] = useState('');
    const [VIN, setVIN] = useState('')

    useEffect(() => {
        const { fromVehicleScreen } = props.route.params;
        if (fromVehicleScreen) {
            setIndex(1);
            getVehicleBrandData();
        } else {
            setIndex(0);
            getVehicleBrandData();
        }
    }, [])

    async function getVehicleBrandData() {
        let isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const brandData = await UserService.getAllVehicalBrand(loginInfo);
            hideHUD();
            if (isGetSuccessData(brandData)) {
                const allVehicleBrandData = get(brandData, 'data', '')
                setBrand(allVehicleBrandData)
            } else {
                apiFallBackAlert(brandData, dark)
            }
        } else {
            showInternetLostAlert(() => {
                getVehicleBrandData()
            });
        }
    }

    async function getVehicleModel(brandId) {

        const brandIdObj = [
            { name: "VehicleBrandID", data: brandId },
        ]

        let isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const vehicleModelData = await UserService.getVehicleModelbyBrandID(loginInfo, brandIdObj);
            hideHUD();
            if (isGetSuccessData(vehicleModelData)) {
                const allVehicleModelData = get(vehicleModelData, 'data', '')

                const mapModelData = map(allVehicleModelData, (el) => {
                    return [{
                        label: get(el, 'VehicleModelName', ''),
                        value: el
                    }]
                });
                setItems(flatten(mapModelData));
            } else {
                apiFallBackAlert(vehicleModelData, dark);
            }
        } else {
            showInternetLostAlert(() => {
                getVehicleModel()
            });
        }
    }

    async function onBrandSelect(item) {
        setIndex(2);
        getVehicleModel(get(item, '_id', ''));
    }

    async function onAddVehical() {
        const { fromVehicleScreen } = props.route?.params;
        const { navigate, reset } = props.navigation;

        const vehicleRegisterReg = /^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/;

        // if (!name) {
        //     warningPopUp('Please enter your name!!', dark)
        // } else if (!(size(email) > 0)) {
        //     warningPopUp('Please enter your email address!!', dark)
        // } else if (emailReg.test(email) === false) {

        if (!get(modelData, 'VehicleModelName', '')) {
            warningPopUp('Please enter vehicle model name!!', dark);
            return;
        } else if (!registrationNo) {
            warningPopUp('Please enter vehicle registration name!!', dark)
            return;
        } else if (vehicleRegisterReg.test(registrationNo) === false) {
            warningPopUp('Invalid vehicle registration name!!', dark)
            return;
        } else {
            const modelObj = [
                { name: "VehicleBrandID", data: get(modelData, 'VehicleBrandID', '') },
                { name: "VehicleBrandName", data: get(modelData, 'VehicleBrandName', '') },
                { name: "VehicleModelID", data: get(modelData, '_id', '') },
                { name: "VehicleModelName", data: get(modelData, 'VehicleModelName', '') },
                { name: "VehicleConnectorID", data: get(modelData, 'VehicleConnectorID', '') },
                { name: "VehicleConnectorName", data: get(modelData, 'VehicleConnectorName', '') },
                { name: "Registration", data: registrationNo },
                { name: "VIN", data: VIN },
            ];

            let isConnected = await checkInternet();
            if (isConnected) {
                showHUD();
                const addVehical = await UserService.addVehical(loginInfo, modelObj);
                hideHUD();
                if (isGetSuccessData(addVehical)) {
                    Toast.show('Successfully Add Vehicle');
                    getVehicleData();

                    if (fromVehicleScreen) {
                        props.navigation.navigate('Tabs')
                    } else {
                        reset({
                            index: 0,
                            routes: [{ name: 'App' }]
                        })
                    }
                }
                else {
                    // let title = "Status code : " + get(addVehical, 'statusCode', 'Alert').toString();;
                    // let description = get(addVehical, 'message', 'Something went wrong');
                    // Alert.alert(title, description,

                    //     [
                    //         { text: 'OK', onPress: () => console.log(description) }
                    //     ],
                    //     { cancelable: false }
                    // );
                    apiFallBackAlert(addVehical, dark);
                    setRegistrationNo('');
                    setVIN('');
                }
            }
            else {
                showInternetLostAlert(() => {
                    onAddVehical()
                });
            }
        }
    }

    async function getVehicleData() {
        const vehicleData = await UserService.getVehicleList(loginInfo);
        if (isGetSuccessData(vehicleData)) {
            let validateVehicleData = get(vehicleData, 'data', '');
            dispatch(saveUserVehicles(validateVehicleData));
        }
    }

    function onBackButtonPress() {
        const { fromVehicleScreen } = props.route?.params;
        if (fromVehicleScreen) {
            if (index <= 1) {
                props.navigation.goBack();
            } else {
                setIndex(index - 1)
            }
        } else {
            if (index == 2) {
                setIndex(0)
            } else {
                props.navigation.goBack();
            }
        }

    }

    return (
        <View style={{ flexGrow: 1, backgroundColor: dark ? '#0E2831' : '#FFF' }}>
            <StickyHeader {...props} onBackButtonPress={() => onBackButtonPress()} headerTitle="Add Vehicles" />
            <View style={{ flex: 1, backgroundColor: dark ? '#0E2831' : '#FFF', paddingHorizontal: index === 0 ? wp(6.5) : 0, paddingBottom: hp(3) }}>
                {
                    index === 0 &&
                    <View style={{ flex: 1 }}>
                        <View style={{ alignSelf: 'flex-end' }}>

                            <VoltLight />

                        </View>
                        <Charging style={{ marginTop: hp(5) }} />
                        <View style={[{ alignItems: 'center', borderRadius: 10, backgroundColor: dark ? colors.BLUEGREY.secondary : colors.GREEN.secondary, marginTop: hp(4), paddingBottom: hp(8) }]}>
                            <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.xBigHeader, marginTop: '3%', color: '#FFF' }]}>Add your personal vehicle</Text>
                            <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.xRegular, marginTop: '1%', color: '#FFF' }]}>Add vehicle details here</Text>
                            <TouchableWithoutFeedback onPress={() => { setIndex(1) }}>
                                <View style={[globalStyle.centeredContent, { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 10, width: '90%', paddingVertical: '7%', marginTop: '10%' }]}>
                                    <Feather name='plus' size={48} color={'#FFF'} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <TouchableWithoutFeedback onPress={() => { props.navigation.navigate('Tabs') }}>
                            <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.extraBig, textAlign: 'center', marginTop: hp(1.5) }]}>Skip</Text>
                        </TouchableWithoutFeedback>
                        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            <Plant />
                        </View>
                    </View>
                }

                {
                    index === 1 &&
                    <View style={{ flexGrow: 1 }}>
                        <View style={[globalStyle.centeredContent, { backgroundColor: colors.BLUEGREY.secondary, paddingVertical: 10 }]} >
                            <ZapCar />
                        </View>
                        <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.title, marginTop: '5%', textAlign: 'center', color: dark ? '#FFF' : '#111' }]}>Select the brand</Text>
                        <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.xRegular, marginTop: '1%', textAlign: 'center', color: dark ? '#FFF' : '#111' }]}>Please select one brand</Text>

                        <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', marginTop: hp(4.85) }}>
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    data={brand}
                                    numColumns={3}
                                    contentContainerStyle={{ flexGrow: 1, alignSelf: 'center' }}
                                    renderItem={({ item }) => {
                                        return (
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={() => onBrandSelect(item)}
                                                style={[globalStyle.centeredContent, { borderRadius: 6, backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', marginHorizontal: wp(1.75), height: hp(18), marginBottom: wp(3.5), width: (width - wp(20)) / 3 }]}>
                                                {
                                                    dark ?
                                                        <Image style={{ height: '100%', width: '100%' }} source={{ uri: item.VehicleBrandImage }} resizeMode='contain' />
                                                        :
                                                        <Image style={{ height: '100%', width: '100%' }} source={{ uri: item.VehicleBrandImage }} resizeMode='contain' />
                                                }
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </View>
                        </View>

                        <View style={{ justifyContent: 'flex-end', paddingTop: 8 }}>
                            <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.big, textAlign: 'center', color: dark ? '#FFF' : '#111' }]}>Can't find your vehicle?</Text>
                            <TouchableWithoutFeedback onPress={() => { }}>
                                <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.big, textAlign: 'center', textDecorationLine: 'underline', color: dark ? '#FFF' : '#111' }]}>Let us know</Text>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                }

                {
                    index === 2 &&
                    <View style={{ flex: 1 }}>
                        <View style={[{ backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', width: '100%', height: heightPercentageToDP(13.5) }]}>
                            <View style={[globalStyle.absoluteContainer, { alignItems: 'center', marginTop: hp(2) }]}>
                                {
                                    dark ?
                                        <TeslaCircleRed />
                                        :
                                        <TeslaCircleDark />
                                }
                            </View>
                        </View>

                        <ScrollView style={{ paddingHorizontal: widthPercentageToDP(4.5) }} showsVerticalScrollIndicator={false}>
                            <KeyboardAwareScrollView extraHeight={-45}>
                                <StyledText style={{ marginTop: hp(7) }} font="light" size={32} color={dark ? '#FFF' : '#0A0A26'} center>Tell us about your vehicle</StyledText>
                                <StyledText style={{ marginTop: hp(1), marginBottom: hp(4) }} font="light" size={15} color={dark ? '#FFF' : '#0A0A26'} center>Fill the below form and update your personal information</StyledText>
                                <DropDownPicker
                                    style={{ backgroundColor: dark ? '#0E2831' : '#FFF', borderRadius: open ? 15 : 50, borderColor: dark ? colors.GREEN.secondary : '#0A0A26', marginBottom: hp(5) }}
                                    textStyle={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.regular, color: dark ? '#FFF' : '#0A0A26' }}
                                    dropDownContainerStyle={{ backgroundColor: dark ? '#0E2831' : '#FFF', borderColor: dark ? colors.GREEN.secondary : '#0E2831' }}
                                    ArrowUpIconComponent={({ style }) => <View />}
                                    ArrowDownIconComponent={() => value == null && <Feather name='chevron-down' size={24} color={dark ? 'rgba(255,255,255,0.5)' : '#0A0A26'} />}
                                    placeholder='Model'
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                    onChangeValue={(value, index) => { setModelData(value) }}
                                />
                                <View style={[globalStyle.rowContainerCentered, { borderRadius: 50, borderWidth: 1, borderColor: dark ? colors.GREEN.secondary : '#0A0A26', marginBottom: hp(5), paddingHorizontal: wp(4.5), height: 50 }]}>
                                    <TextInput value={registrationNo} placeholder={'Vehicle Registration Number'} placeholderTextColor={dark ? '#FFF' : '#0A0A26'} style={{ flex: 1, fontFamily: fonts.MULISH.light, fontSize: fontSizes.light, color: '#fff' }}
                                        onChangeText={(text) => setRegistrationNo(text)} />
                                    <Image source={require('../../../assets/icons/more-info.png')} />
                                </View>
                                <View style={[globalStyle.rowContainerCentered, { borderRadius: 50, borderWidth: 1, borderColor: dark ? colors.GREEN.secondary : '#0A0A26', marginBottom: hp(5), paddingHorizontal: wp(4.5), height: 50 }]}>
                                    <TextInput value={VIN} placeholder={'VIN (optional)'} placeholderTextColor={dark ? '#FFF' : '#0A0A26'} style={{ flex: 1, fontFamily: fonts.MULISH.light, fontSize: fontSizes.light, color: '#fff' }}
                                        onChangeText={(text) => setVIN(text)} />
                                    <Image source={require('../../../assets/icons/more-info.png')} />
                                </View>

                                {/* <Button label='Next Step' onPress={() => { props.navigation.navigate('Tabs') }} /> */}
                                <Button label='Next Step' onPress={() => onAddVehical()} />

                            </KeyboardAwareScrollView>
                        </ScrollView>
                    </View>
                }
            </View>
        </View>
    )
}

export default AddVehicle;