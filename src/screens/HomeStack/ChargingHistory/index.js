import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { FlatList, Image, SafeAreaView, ScrollView, Text, TouchableWithoutFeedback, View, ActivityIndicator } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';
import { RootContainer, StyledText } from 'components';
import UserService from "networkServices/UserService";
import { showHUD, hideHUD } from 'utils/loader';
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';
import { map, get, isEmpty } from "lodash";
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

const history = [
    {
        label: '3 March 2022 | 07 AM - 08 AM',
        id: '#8675',
        status: 'Cancelled',
        key: 1
    },
    {
        label: '3 March 2022 | 07 AM - 08 AM',
        id: '#8675',
        key: 2
    },
    {
        label: '3 March 2022 | 07 AM - 08 AM',
        id: '#8675',
        key: 3
    },
]

const ChargingHistory = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const { loginInfo, deviceFCMToken } = useSelector((state) => state.auth);
    const [chargeHistory, setChargeHistory] = useState([])
    const [historyPageNo, setHistoryPageNo] = useState(0);
    const [guessAPIEnded, GuessIsAPIEnded] = useState(false);

    useEffect(() => {
        setFocusListener();
    }, [])

    function setFocusListener() {
        let focusSubscription = props.navigation.addListener(
            'focus',
            payload => {
                getChargingHistory()
            }
        );
    }

    async function getChargingHistory() {

        let isConnected = await checkInternet();
        if (isConnected) {
            // showHUD();
            const Obj = [
                { name: "page", data: String(historyPageNo + 1) },
            ];
            const chargeHistoryData = await UserService.getChargingHistory(loginInfo, Obj);
            // hideHUD();
            if (isGetSuccessData(chargeHistoryData)) {
                let data = get(chargeHistoryData, 'data', '')
                if (isEmpty(data)) {
                    GuessIsAPIEnded(true)
                } else {
                    setHistoryPageNo(historyPageNo + 1)
                    setChargeHistory([...chargeHistory, ...data])
                }
            } else {
                apiFallBackAlert(chargeHistoryData, dark)
            }
        }
        else {
            showInternetLostAlert(() => {
                getChargingHistory()
            });
        }
    }

    const onLoadMoreChargingData = async () => {
        setHistoryPageNo(historyPageNo + 1)
        if (!guessAPIEnded) {
            getChargingHistory()
        }
    }

    const renderFooter = () => {
        if (guessAPIEnded) return null;
        if (guessAPIEnded) return <Text style={styles.endText}>End Of ChargingHistory</Text>;

        return <ActivityIndicator style={{ color: "#000" }} />;
    };

    return (
        <RootContainer>
            <View showsVerticalScrollIndicator={false} style={{ flexGrow: 1, paddingBottom: hp(12), backgroundColor: dark ? '#0E2831' : '#FFF' }}>
                <View style={[globalStyle.centeredContent, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', paddingVertical: 16 }]}>
                    <StyledText font="light" size={24} color={dark ? '#FFF' : '#0A0A26'} style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.header }}>Charging History</StyledText>
                    <TouchableWithoutFeedback onPress={() => { props.navigation.pop() }}>
                        <Feather style={{ position: 'absolute', left: 18 }} name='chevron-left' size={24} color={dark ? '#FFF' : '#0A0A26'} />
                    </TouchableWithoutFeedback>
                </View>
                <View style={{ paddingTop: 25, paddingHorizontal: wp(5) }}>
                    <FlatList
                        data={chargeHistory}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            return (
                                <TouchableWithoutFeedback onPress={() => { props.navigation.navigate('ChargingDetails', { chargingInfo: item }) }}>
                                    <View style={{ borderRadius: 6, backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF', borderWidth: dark ? 0 : 1, borderColor: dark ? undefined : '#E3E3E3', paddingVertical: 20, marginBottom: 30 }}>
                                        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                                            {/* <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.semiExtraBig, color: dark ? '#FFF' : '#0A0A26' }}>{item.label}</Text> */}
                                            <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.semiExtraBig, color: dark ? '#FFF' : '#0A0A26' }}>{`${moment(get(item, 'created', null)).format("DD MMM YYYY | HH:MM a")}`}{get(item, 'EndTime', null) ? " - " + get(item, 'EndTime', null) : null}</Text>
                                            <View style={[globalStyle.rowContainerCentered, { marginTop: 24 }]}>
                                                <Image source={dark ? require('../../../assets/icons/history-car.png') : require('../../../assets/icons/history-car-green.png')} />
                                                <View style={[globalStyle.centeredContent, { backgroundColor: colors.GREEN.secondary, borderRadius: 50, height: 40, paddingHorizontal: 30, marginLeft: 30 }]}>
                                                    <StyledText font='light' color={'#0A0A26'} size={16}>#8675</StyledText>
                                                </View>
                                                {
                                                    get(item, 'BookingStatus', null) != undefined &&
                                                    <View style={[globalStyle.centeredContent, { borderWidth: 1, borderColor: dark ? '#fff' : '#0A0A26', borderRadius: 50, height: 40, paddingHorizontal: 20, marginLeft: 12 }]}>
                                                        <StyledText font='light' color={dark ? '#FFF' : '#0A0A26'} size={16}>{get(item, 'BookingStatus', '') ? 'Cancelled' : 'Cancelled'}</StyledText>
                                                    </View>
                                                }
                                            </View>
                                        </View>
                                        <View style={{ height: 1, width: '100%', backgroundColor: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.17)' }} />
                                        <View style={[globalStyle.rowContainerCenteredSpaced, { paddingHorizontal: 20, paddingTop: 16 }]}>
                                            <View>
                                                <Text style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.light, color: colors.GREEN.secondary }}>Charger ID & Name</Text>
                                                <Text style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.light, color: dark ? '#FFF' : '#0A0A26' }}>{get(item, 'machines.LocationName', '')}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.light, color: colors.GREEN.secondary, textAlign: 'center' }}>Socket Type</Text>
                                                <Text style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.light, textAlign: 'center', color: dark ? '#FFF' : '#0A0A26' }}>{get(item, 'SocketType', '')}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.light, color: colors.GREEN.secondary, textAlign: 'center' }}>Amount Paid</Text>
                                                <Text style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.light, textAlign: 'center', color: dark ? '#FFF' : '#0A0A26' }}>{Number(get(item, 'amount', '')).toFixed(2)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>

                            )
                        }}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => onLoadMoreChargingData()}
                        ListFooterComponent={() => renderFooter()}
                    />
                </View>

            </View>
        </RootContainer>
    )
}

export default ChargingHistory;