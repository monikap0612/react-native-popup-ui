import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { FlatList, Image, SafeAreaView, ScrollView, Text, TouchableWithoutFeedback, View, TouchableOpacity, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';
import { RootContainer, StyledText } from 'components';
import UserService from "networkServices/UserService";
import { showHUD, hideHUD } from 'utils/loader';
import { ChargeType, Button } from 'components';
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';
import { map, get, flatten, isEmpty, size, first, last } from "lodash";
import { useSelector, useDispatch } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RupeeLight from '../../../assets/icons/rupee-light.svg';
import RupeeDark from '../../../assets/icons/rupee-dark.svg';
import { redirectToMap } from 'utils/Common';

import Connector1 from 'assets/images/connector1.svg';
import Connector2 from 'assets/images/connector2.svg';
import Connector3 from 'assets/images/connector3.svg';
import Connector4 from 'assets/images/connector4.svg';

import LightConnector1 from 'assets/images/connector1-green.svg';
import LightConnector2 from 'assets/images/connector2-green.svg';
import LightConnector3 from 'assets/images/connector3-green.svg';
import LightConnector4 from 'assets/images/connector4-green.svg';

let focusSubscription = null;

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

const Saved = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const { loginInfo, deviceFCMToken, isUpdateAvailable } = useSelector((state) => state.auth);
    const { userCurrentLocation } = useSelector((state) => state.home);

    const [favLocationList, setFavLocationList] = useState([]);
    const [activeIndex, setActiveIndex] = useState('')

    useEffect(() => {
        getAllFavLocations();
        setFocusListener();
    }, [])

    function setFocusListener() {
        focusSubscription = props.navigation.addListener(
            'focus',
            payload => {
                getAllFavLocations();
            }
        );
    }

    async function getAllFavLocations(searchText) {
        // console.log('--- getAllFavLocations ---')
        let isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const favLocationList = await UserService.allFavChargingLocations(loginInfo);
            hideHUD();
            console.log("---favLocationList--", favLocationList);
            if (isGetSuccessData(favLocationList)) {
                setFavLocationList(get(favLocationList, 'data', ''))
            } else {
                apiFallBackAlert(favLocationList, dark)
            }
        }
        else {
            showInternetLostAlert(() => {
                getAllFavLocations()
            });
        }
    }

    const onLocationInfo = (item) => {
        const locationData = {
            "_id": get(item, 'LocationID', null)
        }
        props.navigation.navigate('BookChargingSlot', { locationData: locationData })
    }

    function redirectToNativeMap(LongLat) {
        const redirectionPayload = {
            startAddress: userCurrentLocation,
            endAddress: {
                latitude: last(LongLat),
                longitude: first(LongLat)
            }
        }

        redirectToMap(redirectionPayload)
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

    function renderSelectedLocationPorts(item, index) {
        const connectorType = get(item, 'MachineConnectorNo', 1);
        return (
            <View style={{ marginLeft: wp(5), paddingTop: hp(1.5), marginRight: wp(5), flexDirection: "column", justifyContent: "space-between" }}>
                {connectorImageByType(connectorType)}
                <View style={{ marginTop: 8 }}>
                    <Text style={{ color: dark ? "#fff" : "#000", }}>{get(item, 'VehicleConnectorName', '')}</Text>
                    <Text style={{ color: dark ? "#fff" : "#000", }}>{get(item, 'VehicleConnectorText', '')}</Text>
                    <Text style={{ color: dark ? "#fff" : "#000", fontSize: 14 }}>{get(item, 'VehicleConnectorName', '')}</Text>
                    <Text style={{ color: dark ? "#fff" : "#000" }}>{get(item, 'Availability', '') == 0 ? 'Unavailable' : 'Available'}</Text>
                </View>
            </View>
        )
    }

    return (
        <View showsVerticalScrollIndicator={false} style={{ flexGrow: 1, backgroundColor: dark ? '#0E2831' : '#FFF' }}>
            <View style={[globalStyle.centeredContent, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', paddingVertical: 16 }]}>
                <StyledText font="light" size={24} color={dark ? '#FFF' : '#0A0A26'} style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.header }}>Favourites</StyledText>
                <TouchableWithoutFeedback onPress={() => { props.navigation.goBack() }}>
                    <Feather style={{ position: 'absolute', left: 18 }} name='chevron-left' size={24} color={dark ? '#FFF' : '#0A0A26'} />
                </TouchableWithoutFeedback>
            </View>
            <RootContainer>
                <View style={{ paddingHorizontal: wp(5) }}>
                    <FlatList
                        data={favLocationList}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ borderRadius: 6, backgroundColor: dark ? '#23424f' : '#F4F4F4', paddingBottom: 20, marginTop: 20 }}>
                                    <View style={{ paddingLeft: 26, paddingRight: 16, paddingVertical: 16 }}>
                                        <View style={[globalStyle.rowContainerCenteredSpaced]}>
                                            <TouchableOpacity onPress={() => { props.navigation.navigate('BookChargingSlot', { locationData: get(item, 'locationInfo', '') }) }}>
                                                <Text style={[{ fontFamily: fonts.MULISH.medium, fontSize: fontSizes.semiExtraBig, color: dark ? '#FFF' : '#111' }]}>{get(item, 'locationInfo.LocationName', '')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <Ionicons name='bookmark' size={30} color={colors.GREEN.secondary} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[globalStyle.rowContainerCentered]}>
                                            <StyledText font='light' size={14} color={get(item, 'locationInfo.openStatus', false) ? colors.GREEN.secondary : dark ? '#FFF' : '#0A0A26'}>Open </StyledText>
                                            <StyledText font='light' size={14} color={get(item, 'locationInfo.openStatus', false) ? dark ? '#FFF' : '#0A0A26' : colors.RED.primary}> Close </StyledText>
                                            <StyledText font='light' size={14} color={dark ? '#FFF' : '#0A0A26'}>11:00 PM</StyledText>
                                        </View>
                                    </View>
                                    <View style={{ height: 1, width: '100%', backgroundColor: dark ? 'rgba(255,255,255,0.06)' : '#F4F4F4' }} />
                                    <View style={{ paddingVertical: 16 }}>
                                        <Text style={[{ fontFamily: fonts.MULISH.medium, fontSize: fontSizes.semiExtraBig, marginLeft: 26, color: dark ? '#FFF' : '#111' }]}>Available Ports</Text>
                                        <View>
                                            <FlatList
                                                data={get(item, 'port', [])}
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({ item, index }) => renderSelectedLocationPorts(item, index)}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: 26 }}>
                                        <View style={[globalStyle.rowContainerCenteredSpaced]}>
                                            <View style={[globalStyle.rowContainerCentered]}>
                                                <View style={styles.greenCircle}>
                                                    {/* <Feather name='dollar-sign' size={14} /> */}
                                                    {
                                                        dark ?
                                                            <RupeeLight />
                                                            :
                                                            <RupeeDark />
                                                    }
                                                </View>
                                                <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.xLight, marginLeft: 6, color: dark ? '#FFF' : '#111' }]}>{get(item, 'locationInfo.pricePerUnit', 0)} Per Unit</Text>
                                            </View>
                                            <View style={[globalStyle.rowContainerCentered]}>
                                                <View style={styles.greenCircle}>
                                                    <Feather name='map-pin' size={14} color={dark ? '#FFF' : '#0A0A26'} />
                                                </View>
                                                <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.xLight, marginLeft: 6, color: dark ? '#FFF' : '#111' }]}>{get(item, 'locationInfo.distance', 0)}KM</Text>
                                            </View>
                                            <TouchableOpacity style={[globalStyle.rowContainerCentered]} onPress={() => redirectToNativeMap(get(item, 'locationInfo.LongLat', ''))}>
                                                <View style={styles.greenCircle}>
                                                    <Feather name='arrow-right' size={14} color={dark ? '#FFF' : '#0A0A26'} />
                                                </View>
                                                <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.xLight, marginLeft: 6, color: dark ? '#FFF' : '#111' }]}>Get Direction</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.light, marginVertical: 16, color: dark ? '#FFF' : '#111' }]}>{get(item, 'locationInfo.Address', '')}</Text>
                                        <Button label='Charge' onPress={() => { props.navigation.navigate('BookChargingSlot', { locationData: get(item, 'locationInfo', '') }) }} />
                                    </View>
                                </View>
                            )
                        }}
                    />
                </View>
            </RootContainer>

        </View>
    )
}
const styles = StyleSheet.create({
    greenCircle: {
        borderRadius: 50,
        backgroundColor: colors.GREEN.secondary,
        height: 20,
        width: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Saved;