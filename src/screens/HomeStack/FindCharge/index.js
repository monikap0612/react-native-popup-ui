import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { RootContainer, StickyHeader } from 'components';
import { useTheme } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, globalStyle, fonts, fontSizes } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ChargeType, Button } from 'components';
import RupeeLight from '../../../assets/icons/rupee-light.svg';
import RupeeDark from '../../../assets/icons/rupee-dark.svg';
import UserService from "networkServices/UserService";
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';
import { useSelector, useDispatch } from 'react-redux';
import { map, get, flatten, first, last } from "lodash";
import { redirectToMap, warningPopUp } from 'utils/Common';
import { hideHUD, showHUD } from "utils/loader";
import Toast from 'react-native-simple-toast';

import Connector1 from 'assets/images/connector1.svg';
import Connector2 from 'assets/images/connector2.svg';
import Connector3 from 'assets/images/connector3.svg';
import Connector4 from 'assets/images/connector4.svg';

import LightConnector1 from 'assets/images/connector1-green.svg';
import LightConnector2 from 'assets/images/connector2-green.svg';
import LightConnector3 from 'assets/images/connector3-green.svg';
import LightConnector4 from 'assets/images/connector4-green.svg';

const chargingStations = [
    {
        key: 1
    },
    {
        key: 2
    },
]

const FindCharge = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const { loginInfo, deviceFCMToken, isUpdateAvailable } = useSelector((state) => state.auth);
    const { userCurrentLocation } = useSelector((state) => state.home);

    const [chargingLocationList, setChargingLocationList] = useState([]);
    const [port, setPort] = useState([]);
    const [activeIndex, setActiveIndex] = useState('')
    const [locationInfo, setLocationInfo] = useState([]);

    useEffect(() => {
        getCharginLocation();
    }, [])

    async function getCharginLocation(searchText) {

        let isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const chargingLocationsData = await UserService.getChargingLocations(loginInfo);
            console.log('--- chargingLocationsData ---', chargingLocationsData)
            hideHUD();
            if (isGetSuccessData(chargingLocationsData)) {
                const data = get(chargingLocationsData, 'data.chargingLocation', null)

                const mapLocationData = map(data, (el) => {
                    return { ...el, isFav: false }
                })

                setChargingLocationList(data);
                // setPort(get(chargingLocationsData, 'data.ports', []))
            } else {
                apiFallBackAlert(chargingLocationsData, dark);
            }
        }
        else {
            showInternetLostAlert(() => {
                getCharginLocation()
            });
        }
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

    async function onAddFavorite(locationId, index) {

        const mapLocationData = map(chargingLocationList, (el, el_index) => {
            return { ...el, isFav: el_index == index ? !get(el, 'is_favorite', false) : get(el, 'is_favorite', false) }
        })

        setChargingLocationList(mapLocationData);

        setActiveIndex(index)
        const Obj = {
            LocationID: locationId,
            Toggle: true
        }

        let isConnected = await checkInternet();
        if (isConnected) {
            const addFavLocation = await UserService.addFavChargingLocations(loginInfo, JSON.stringify(Obj));
            if (isGetSuccessData(addFavLocation)) {
                Toast.show('Successfully mark as favorite', Toast.LONG);
            }
            else {
                apiFallBackAlert(addFavLocation, dark);
            }
        }
        else {
            showInternetLostAlert(() => {
                onAddFavorite()
            });
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
        <RootContainer>
            <StickyHeader {...props} headerTitle="Find Charge" />
            <View showsVerticalScrollIndicator={false} style={{ flexGrow: 1, paddingTop: hp(1.5), paddingBottom: 100, paddingHorizontal: wp(5), backgroundColor: dark ? '#0E2831' : '#FFF' }}>

                <View style={[globalStyle.rowContainerCenteredSpaced, { marginBottom: 12 }]}>
                    <Text style={[{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.extraBig, color: dark ? '#FFF' : '#111' }]}>Nearest to your current location</Text>
                    <Image source={require('../../../assets/icons/location.png')} />
                </View>

                <FlatList
                    data={chargingLocationList}
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
                                        <TouchableOpacity onPress={() => onAddFavorite(get(item, 'locationInfo._id', ''), index)}>
                                            {
                                                get(item, 'is_favorite', false) ?
                                                    <Ionicons name='bookmark' size={30} color={colors.GREEN.secondary} />
                                                    :
                                                    <Ionicons name='bookmark-outline' size={30} />
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[globalStyle.rowContainerCentered]}>
                                        <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.regular, color: colors.GREEN.primary }]}>Open </Text>
                                        <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.regular, color: dark ? '#FFF' : '#111' }]}> Close 11:00 PM</Text>
                                    </View>
                                </View>
                                <View style={{ height: 1, width: '100%', backgroundColor: dark ? 'rgba(255,255,255,0.06)' : '#F4F4F4' }} />
                                <View style={{ paddingVertical: 16 }}>
                                    <Text style={[{ fontFamily: fonts.MULISH.medium, fontSize: fontSizes.semiExtraBig, marginLeft: 26, color: dark ? '#FFF' : '#111' }]}>Available Ports</Text>
                                    <View style={{ marginLeft: 10 }}>
                                        <FlatList
                                            data={get(item, 'connector', [])}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => renderSelectedLocationPorts(item, index)}
                                        // renderItem={({ item }) => {
                                        //     return (
                                        //         <View style={{ marginLeft: wp(5), paddingTop: hp(1.5), marginRight: wp(5), flexDirection: "row", justifyContent: "space-between" }}>
                                        //             <View>
                                        //                 <Text style={{ color: dark ? "#fff" : "#000", fontSize: 14 }}>{get(item, 'VehicleConnectorName', '')}</Text>
                                        //                 <Text style={{ color: dark ? "#fff" : "#000", }}>{get(item, 'VehicleConnectorText', '')}</Text>
                                        //             </View>
                                        //             <View style={{ alignSelf: "center" }}>
                                        //                 <Text style={{ color: dark ? "#fff" : "#000" }}>{get(item, 'Availability', '') == 0 ? 'Unavailable' : 'Available'}</Text>
                                        //             </View>
                                        //         </View>
                                        //     )
                                        // }
                                        // }
                                        />
                                    </View>

                                    {/* <ScrollView contentContainerStyle={{ paddingTop: hp(1.5) }} horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <ChargeType dark={dark} style={{ marginLeft: wp(5) }} label='CCS TYPE 2' cost='₹16/kWh - ₹0.88/min' available={true} />
                                    <ChargeType dark={dark} label='CCS TYPE 2' cost='₹16/kWh - ₹0.88/min' available={false} />
                                    <ChargeType dark={dark} label='CCS TYPE 2' cost='₹16/kWh - ₹0.88/min' available={false} />
                                </ScrollView> */}
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
                                            <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.xLight, marginLeft: 6, color: dark ? '#FFF' : '#111' }]}>{get(item, 'pricePerUnit', 0)} Per Unit</Text>
                                        </View>
                                        <View style={[globalStyle.rowContainerCentered]}>
                                            <View style={styles.greenCircle}>
                                                <Feather name='map-pin' size={14} color={dark ? '#FFF' : '#0A0A26'} />
                                            </View>
                                            <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.xLight, marginLeft: 6, color: dark ? '#FFF' : '#111' }]}>{get(item, 'distance', 0)}KM</Text>
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

export default FindCharge;