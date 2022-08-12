import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { colors, globalStyle } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';
import { Button, StyledText } from 'components';
import { milSecondToMinutesAndSeconds } from 'utils/Common';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import WalletGreen from '../../../assets/icons/wallet-green.svg';
import UserService from "networkServices/UserService";
import { get } from 'lodash';
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';
import { showHUD, hideHUD } from "utils/loader";
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

const Row = (props) => {
    return (
        <View style={[globalStyle.rowContainerCenteredSpaced, { paddingVertical: hp(1) }]}>
            <StyledText font='light' size={15} color={props.dark ? '#FFF' : '#0A0A26'}>{props.label}</StyledText>
            <StyledText font='medium' size={15} color={props.dark ? '#FFF' : '#0A0A26'}>{props.result}</StyledText>
        </View>
    )
}

const ChargingDetails = (props) => {

    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const { loginInfo } = useSelector((state) => state.auth);
    const [bookDetail, setBookDetails] = useState(null);

    useEffect(() => {
        getChargingDetails()
    }, [])

    async function getChargingDetails() {
        const { chargingInfo } = props.route?.params

        const Obj = [
            // { name: "ChargingSessionId", data: get(chargingInfo, 'ChargingSessionId', '') },
            { name: "transaction_id", data: get(chargingInfo, 'TransID', '') },
        ];

        let isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const chargingDetails = await UserService.chargingDetails(loginInfo, Obj);
            hideHUD();
            if (isGetSuccessData(chargingDetails)) {
                const data = get(chargingDetails, 'data', null);
                setBookDetails(data)
            }
            else {
                apiFallBackAlert(chargingDetails, dark)
            }
        }
        else {
            showInternetLostAlert(() => {
                getChargingDetails()
            });
        }
    }

    const priceValueValidation = (keyName) => {
        return parseFloat(get(bookDetail, keyName, 0)).toFixed(2)
    }

    return (
        <View style={{ flex: 1, backgroundColor: dark ? '#0E2831' : '#FFF', paddingVertical: hp(2) }}>
            <View style={[globalStyle.centeredContent, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', paddingVertical: hp(1.5) }]}>
                <StyledText font='light' size={32} color={dark ? '#FFF' : '#0A0A26'}>Booking Details</StyledText>
                <TouchableWithoutFeedback onPress={() => { props.navigation.pop() }}>
                    <Feather style={{ position: 'absolute', left: 18 }} name='chevron-left' size={24} color={dark ? '#FFF' : '#0A0A26'} />
                </TouchableWithoutFeedback>
            </View>

            <View style={{ paddingHorizontal: wp(4.7), paddingTop: hp(2) }}>
                <Row label='Transaction ID' result={get(bookDetail, 'BookingId', '')} dark={dark} />
                {/* 'Thu, 12th May 2022 | 11:45AM' */}
                <Row label='Date and Time' result={`${moment(get(bookDetail, 'BookingStartTime', null)).format('ddd, Mo MMM YYYY | hh:mm A')}`} dark={dark} />
                <Row label='Booked For' result={`${milSecondToMinutesAndSeconds(get(bookDetail, 'BookedFor', 0))} Min`} dark={dark} />
                <Row label='Charged For' result={`${milSecondToMinutesAndSeconds(get(bookDetail, 'ChargedFor', 0))} Min`} dark={dark} />
                <Row label='Total Units'  result={`${get(bookDetail, 'FinalEnergy', '')}Kw`} dark={dark} />
                <Row label='Charger' result={get(bookDetail, 'Location', '')} dark={dark} />
            </View>

            <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.21)', paddingVertical: hp(1.3), paddingLeft: wp(4.7), marginVertical: hp(1.5) }}>
                <StyledText font='semiBold' size={20} color={colors.GREEN.secondary}>Pricing Details</StyledText>
            </View>

            <View style={{ paddingHorizontal: wp(4.7) }}>
                <Row label='Price Per Unit' result={`RS. ${priceValueValidation('PricePerUnit')}/Kwh`} dark={dark} />
                <Row label='Subtotal' result={`RS. ${priceValueValidation('SubTotalAmount')}`} dark={dark} />
                <Row label='GST' result={`RS. ${priceValueValidation('GST')}`} dark={dark} />
                <Row label='Parking Charges' result={`RS. ${priceValueValidation('ParkingCharges')}`} dark={dark} />
                <Row label='Service Charger' result={`RS. ${priceValueValidation('ServiceCharges')}`} dark={dark} />
                <Row label='GST on Services Charge' result={`RS. ${priceValueValidation('GSTOnServiceCharges')}`} dark={dark} />
                <View style={[globalStyle.rowContainerCenteredSpaced, { paddingVertical: hp(2) }]}>
                    <StyledText font='semiBold' size={20} color={dark ? '#FFF' : '#0A0A26'}>Total Price</StyledText>
                    <StyledText font='semiBold' size={20} color={colors.GREEN.secondary}>RS. {priceValueValidation('TotalAmount')}</StyledText>
                </View>

                <View style={{ flexDirection: 'row', backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF', alignItems: 'center', borderWidth: dark ? 0 : 1, borderRadius: 8, paddingLeft: wp(4), paddingVertical: wp(2), borderColor: '#E0E0E0' }}>
                    <WalletGreen />
                    <StyledText style={{ marginLeft: wp(3.4) }} font='regular' size={16} color={dark ? '#FFF' : '#0A0A26'}>Payment made using wallet</StyledText>
                </View>

            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: wp(4.7) }}>
                <Button label='Done' onPress={() => { props.navigation.navigate('Home') }} />
            </View>

        </View>
    )
}

export default ChargingDetails;