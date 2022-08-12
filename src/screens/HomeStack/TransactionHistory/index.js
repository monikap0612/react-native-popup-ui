import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { FlatList, Image, SafeAreaView, ScrollView, Text, View, TouchableOpacity, Platform, StyleSheet } from "react-native";
import { StickyHeader } from 'components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';
import { StyledText } from 'components';
import UserService from "networkServices/UserService";
import { showHUD, hideHUD } from 'utils/loader';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';
import { map, get } from "lodash";
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-native-neat-date-picker'

const data = [
    {
        key: 0,
        lable: 'Welcome to React-Native',
        date: 'July 5, 2022',
        amount: 500,
        status: 'Success',
        GST: 100,
        Credit: 0,
        image: require('../../../assets/images/wallet_dark.png')
    },
    {
        key: 1,
        lable: 'Welcome to React-Native',
        date: 'July 5, 2022',
        amount: 500,
        status: 'Success',
        GST: 100,
        Credit: 0,
        image: require('../../../assets/images/wallet_dark.png')
    },
    {
        key: 2,
        lable: 'Welcome to React-Native',
        date: 'July 5, 2022',
        amount: 500,
        status: 'Success',
        GST: 100,
        Credit: 0,
        image: require('../../../assets/images/wallet_dark.png')
    }
]

const TransactionHistory = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const { loginInfo, deviceFCMToken } = useSelector((state) => state.auth);
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [expandedIndex, setExpandedIndex] = useState(0);
    const [transHistory, setTransHistory] = useState([])
    const [date, setDate] = useState(moment(new Date()).format("MMM DD, YYYY"))

    const colorOptions = {
        headerColor: dark ? '#0E2831' : colors.GREEN.secondary,
        backgroundColor: '#FFF8F0',
        selectedDateBackgroundColor: dark ? colors.BLUEGREY.secondary : '#3D413D',
        selectedDateColor: dark ? colors.BLUEGREY.secondary : '#FFFFFF',
        changeYearModalColor: dark ? '#0E2831' : colors.GREEN.secondary,
    }

    useEffect(() => {
        onTransactionHistory()
    }, [])

    const toggleList = (key, isExpanded) => {
        // if (expandedIndex === key) {
        //     setExpandedIndex(-1);
        // } else {
            setExpandedIndex(key);
        // }
    }

    const openDatePicker = () => {
        setShowDatePicker(true)
    }

    const onCancel = () => {
        setShowDatePicker(false)
    }

    const onConfirm = (output) => {
        setShowDatePicker(false)
        setDate(moment(output.date).format("MMM DD, YYYY"))

    }

    const onTransactionHistory = async (element) => {
        let isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const transactionHistoryData = await UserService.getTransactionHistory(loginInfo);
            console.log("----transactionHistory---", transactionHistoryData);
            hideHUD();
            if (isGetSuccessData(transactionHistoryData)) {
                let data = get(transactionHistoryData, 'data', [])
                setTransHistory(data)
            } else {
                apiFallBackAlert(transactionHistoryData, dark);
            }
        } else {
            showInternetLostAlert(() => {
                onTransactionHistory();
            });
        }
    }

    const renderItem = (item, index) => {
        return (
            <View>
                <Collapse
                    style={{ borderWidth: item.TransID === expandedIndex ? 1 : 0, borderRadius: 6, borderColor: dark ? 'rgba(255,255,255,0.45)' : colors.GREEN.secondary, overflow: 'hidden', backgroundColor: item.TransID === expandedIndex ? (dark ? colors.BLUEGREY.other : '#F4F4F4') : (dark ? colors.BLUEGREY.secondary : '#F4F4F4'), marginBottom: item.TransID === expandedIndex ? hp(5.4) : hp(3.2) }}
                    isExpanded={item.TransID === expandedIndex}
                    onToggle={(isExpanded) => toggleList(item.TransID, isExpanded)}
                >
                    <CollapseHeader>
                        <View style={{ flexDirection: "row", padding: hp(2) }}>
                            <View>
                                <Image source={require('../../../assets/images/wallet_dark.png')} style={{ height: hp(10), width: wp(10), tintColor: dark ? '#fff' : '#000' }} resizeMode='contain' />
                            </View>
                            <View style={{ alignSelf: "center", flex: 1, paddingHorizontal: wp(5) }}>
                                <Text numberOfLines={1} style={{ fontFamily: fonts.MULISH.light, color: dark ? '#FFF' : '#0A0A26', fontSize: 18 }}>Transaction to Charging</Text>
                                <Text style={{ fontFamily: fonts.MULISH.light, color: dark ? '#FFF' : '#0A0A26', fontSize: 16 }}>July 5, 2022</Text>
                            </View>
                            <View style={{ alignSelf: "center" }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ fontFamily: fonts.MULISH.light, color: dark ? '#FFF' : '#0A0A26', fontSize: 20 }}>+</Text>
                                    <Text style={{ fontFamily: fonts.MULISH.light, color: dark ? '#FFF' : '#0A0A26', fontSize: 20 }}>{get(item, 'totalAmt', '')}</Text>
                                </View>
                                <Text style={{ fontFamily: fonts.MULISH.light, color: dark ? colors.GREEN.secondary : colors.GREEN.secondary, fontSize: 16, textAlign: "right" }}>Success</Text>
                            </View>
                        </View>
                    </CollapseHeader>
                    <CollapseBody>
                        <View style={[styles.body, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF', flexDirection: "row", justifyContent: "center", alignItems: "center" }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.regular, lineHeight: 26, color: colors.GREEN.secondary }}>GST</Text>
                                <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.regular, lineHeight: 26, color: dark ? '#fff' : '#000' }}>{parseFloat(get(item, 'tax_amount', 0)).toFixed(2)}</Text>
                            </View>
                            <View>
                                <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.regular, lineHeight: 26, color: colors.GREEN.secondary, alignSelf: "center" }}>Credit Value</Text>
                                <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.regular, lineHeight: 26, color: dark ? '#fff' : '#000', alignSelf: "center" }}>{parseFloat(get(item, 'amount', 0)).toFixed(2)}</Text>
                            </View>
                        </View>
                    </CollapseBody>
                </Collapse>
            </View>
        )
    }

    return (
        <View style={{ flexGrow: 1, backgroundColor: dark ? '#0E2831' : '#FFF' }}>
            <StickyHeader {...props} headerTitle="Transaction History" />
            <View showsVerticalScrollIndicator={false} style={{ flexGrow: 1, marginTop: 8, paddingBottom: hp(12), backgroundColor: dark ? '#0E2831' : '#FFF' }}>
                <View style={[globalStyle.centeredContent, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', paddingVertical: 16, height: hp(20) }]}>
                    <Text style={{ fontFamily: fonts.MULISH.light, fontSize: 30, color: dark ? '#FFF' : '#0A0A26', fontWeight: '400' }}>Transaction History</Text>
                    <TouchableOpacity style={{ height: hp(6), width: wp(90), backgroundColor: dark ? '#0E2831' : '#FFF', borderRadius: 5, alignSelf: "center", margin: hp(2), justifyContent: "center" }}
                        onPress={() => openDatePicker()}>
                        <View style={{ flexDirection: "row", padding: hp(2) }}>
                            <View style={{ height: hp(6), alignSelf: "center", flex: 1, justifyContent: "center" }}>
                                <Text style={{ fontFamily: fonts.MULISH.light, color: dark ? '#FFF' : '#0A0A26', fontSize: 20, fontWeight: '400' }}>{date}</Text>
                            </View>
                            <TouchableOpacity onPress={() => openDatePicker()} style={{ alignSelf: "center" }}>
                                <Feather style={{ alignSelf: "flex-end" }} name='chevron-down' size={24} color={dark ? '#FFF' : '#0A0A26'} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>

                </View>
                <View style={{ marginTop: hp(2), flex: 1, padding: wp(5) }}>
                    <FlatList
                        data={transHistory}
                        renderItem={({ item, index }) => renderItem(item, index)}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                <DatePicker
                    isVisible={showDatePicker}
                    colorOptions={colorOptions}
                    mode={'single'}
                    onCancel={onCancel}
                    onConfirm={onConfirm}

                />

            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    datePicker: {
        width: 320,
        height: 260,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16
    },
    body: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 16,
    }
})

export default TransactionHistory;