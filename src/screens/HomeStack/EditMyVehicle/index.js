import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, SafeAreaView, Text, TextInput, TouchableWithoutFeedback, View, Alert, ScrollView, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';
import SvgUri from 'react-native-svg-uri';
import { Button, StyledText, StickyHeader } from 'components';
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

const AddVehicle = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const dispatch = useDispatch();

    const { selectedVehicle } = props.route?.params;

    const { loginInfo, deviceFCMToken } = useSelector((state) => state.auth);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    const [modelData, setModelData] = useState([])
    const [registrationNo, setRegistrationNo] = useState('');
    const [VIN, setVIN] = useState('')
    const [brand, setBrand] = useState([])

    useEffect(() => {
        // getVehicleModel()
    }, [])

    async function getVehicleModel() {

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

    async function editVehicleData() {
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

        }
    }

    console.log('--- selectedVehicle ---', selectedVehicle)
    return (
        <View style={{ flexGrow: 1, backgroundColor: dark ? '#0E2831' : '#FFF' }}>
            <StickyHeader {...props} headerTitle="Edit Vehicles" />
            <View style={{ flex: 1, backgroundColor: dark ? '#0E2831' : '#FFF', paddingHorizontal: 0, marginTop: 8, paddingBottom: hp(3) }}>
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

                            <Button label='Next Step' onPress={() => editVehicleData()} />

                        </KeyboardAwareScrollView>
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}

export default AddVehicle;