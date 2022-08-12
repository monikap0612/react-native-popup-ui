import { useTheme } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, View, TouchableOpacity, Alert, Linking, Platform, FlatList } from "react-native";
import { colors, globalStyle } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChargeType, Button, StyledText, RootContainer, StickyHeader } from 'components';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ChargingPoint from '../../../assets/images/charging-point1.svg';
import ArrowRight from '../../../assets/icons/arrow-right.svg';
import UserService from "networkServices/UserService";
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';
import { useSelector, useDispatch } from 'react-redux';
import { setUserSelectedConnector } from 'reduxStore/actions/charging';
import { map, get, flatten, first, last, omit } from "lodash";
import { redirectToMap, shareLocationInvite, warningPopUp, minToHH } from 'utils/Common';
import { showHUD, hideHUD } from "utils/loader";
import { getLocationLink } from "firebaseAction/dynamicLinks";
import { Popup } from 'popup-ui';

import Toast from 'react-native-simple-toast';

const BookChargingSlot = (props) => {

    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const dispatch = useDispatch();
    const { loginInfo, deviceFCMToken, isUpdateAvailable } = useSelector((state) => state.auth);
    const { userCurrentLocation } = useSelector((state) => state.home);

    const [chargingLocInfo, setLocationInfo] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [machineInfo, setMachineInfo] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isLocationFav, setLocationFav] = useState(false);

    useEffect(() => {
        getChargingLocInfo();
    }, [])

    async function getChargingLocInfo() {
        const { locationData } = props.route?.params;

        const locationId = get(locationData, '_id', '') || props.LocationID;
        const Obj = [
            { name: "LocationID", data: locationId },
        ];

        let isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const locationInfo = await UserService.getChargingLocationInfo(loginInfo, Obj);
            hideHUD();
            if (isGetSuccessData(locationInfo)) {
                const chargingLocation = get(get(locationInfo, 'data', ''), 'chargingLocation', '');
                setLocationInfo(chargingLocation);
                setAmenities(get(get(locationInfo, 'data', ''), 'amenities', []));
                const isFav = get(first(chargingLocation), 'is_favorite', false);
                setLocationFav(isFav)
            } else {
                apiFallBackAlert(locationInfo, dark);
            }
        }
        else {
            showInternetLostAlert(() => {
                getChargingLocInfo()
            });
        }
    }

    // async function onReportChargingLocation() {
    //     const { locationData } = props.route.params;

    //     const Obj = [
    //         { name: "LocationID", data: get(locationData, '_id', '') },
    //         { name: "UserID", data: get(loginInfo, 'userid', '') }
    //     ];

    //     let isConnected = await checkInternet();
    //     if (isConnected) {
    //         showHUD();
    //         const reportLocation = await UserService.reportCharginLocation(loginInfo, Obj);
    //         hideHUD();
    //         if (isGetSuccessData(reportLocation)) {
    //             Toast.show('Report charging station success', Toast.LONG);
    //         }
    //         else {
    //             let title = "Message";
    //             let description = get(reportLocation, 'message', 'Something went wrong');
    //             Alert.alert(title, description,
    //                 [
    //                     { text: 'OK', onPress: () => console.log(description) }
    //                 ],
    //                 { cancelable: false }
    //             );
    //         }
    //     }
    //     else {
    //         showInternetLostAlert(() => {
    //             onReportChargingLocation()
    //         });
    //     }
    // }

    function onReportChargingLocation() {
        const { locationData } = props.route.params;

        props.navigation.navigate('Account', {
            screen: 'ReportIssue', params: {
                isFromBooking: true,
                locationId: get(locationData, '_id', '')
            }
        });
    }

    async function getAllFavLocations(searchText) {

        let isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const favLocationList = await UserService.allFavChargingLocations(loginInfo);
            hideHUD();
            if (isGetSuccessData(favLocationList)) {
            }
        }
        else {
            showInternetLostAlert(() => {
                getAllFavLocations()
            });
        }
    }

    async function onAddFavorite() {
        const { locationData } = props.route.params;

        const Obj = {
            LocationID: get(locationData, '_id', ''),
            Toggle: true
        }

        let isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const addFavLocation = await UserService.addFavChargingLocations(loginInfo, JSON.stringify(Obj));
            hideHUD();
            if (isGetSuccessData(addFavLocation)) {
                Toast.show('Successfully mark as favorite', Toast.LONG);
                setLocationFav(!isLocationFav)
            }
            else {
                let title = "Message";
                let description = get(addFavLocation, 'message', 'Something went wrong');
                apiFallBackAlert(addFavLocation, dark);

                // Alert.alert(title, description,
                //     [
                //         { text: 'OK', onPress: () => console.log(description) }
                //     ],
                //     { cancelable: false }
                // );
            }
        }
        else {
            showInternetLostAlert(() => {
                onAddFavorite()
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

    function onBookChargingSlot() {
        if (machineInfo.length == 0) {
            // alert("Please select Connector")
            warningPopUp("Please select Connector", dark)
        } else {
            onConnectorSelection()
        }
    }

    async function onConnectorSelection() {

        let MachineID = get(machineInfo, 'MachineID', '');
        let LocationID = get(chargingLocInfo[0], '_id', '');
        let ConnectorID = get(machineInfo, 'ConnectorID', '');

        const Obj = [
            { name: "MachineId", data: MachineID },
            { name: "LocationID", data: LocationID },
            { name: "ConnectorID", data: ConnectorID }
        ];

        let isConnected = await checkInternet();
        if (isConnected) {
            if (MachineID == '' || ConnectorID == '') {
                // alert("It seems like missing Machine Id or Connector Id.")
                warningPopUp("It seems like missing Machine Id or Connector Id.", dark)
            } else {
                showHUD();
                const selectionData = await UserService.connectorSelection(loginInfo, Obj);
                hideHUD();
                if (isGetSuccessData(selectionData)) {
                    const userConnectorPayload = {
                        locationInfo: omit(chargingLocInfo[0], 'Machines'),
                        machineInfo: machineInfo
                    }
                    dispatch(setUserSelectedConnector(userConnectorPayload))
                    // setUserSelectedConnector
                    props.navigation.navigate('ChargingInitialization',
                        {
                            locationInfo: omit(chargingLocInfo[0], 'Machines'),
                            machineInfo: machineInfo
                        })
                }
                else {
                    apiFallBackAlert(selectionData, dark)
                }
            }
        }
        else {
            showInternetLostAlert(() => {
                onConnectorSelection()
            });
        }
    }

    function onConnectorSelect(item, index) {
        setSelectedIndex(index);
        setMachineInfo(item);
    }

    // const onShareLocation = async (locationId) => {
    //     if (locationId) {
    //         showHUD();
    //         const locationLink = await getLocationLink(locationId);
    //         hideHUD();
    //         shareLocationInvite(locationLink)
    //     }
    // }
    const onShareLocation = async (selectedLocationInfo) => {
        const locationId = get(selectedLocationInfo, '_id', null);
        if (locationId) {
            showHUD();
            const locationLink = await getLocationLink(locationId);
            const shareLocationPayload = {
                locationLink: locationLink,
                locationName: get(selectedLocationInfo, 'LocationName', ''),
                address: get(selectedLocationInfo, 'Address', ''),
                contactNumber: get(selectedLocationInfo, 'ContactNumber', ''),
            }

            hideHUD();
            shareLocationInvite(shareLocationPayload)
            // console.log('--- onShareLocation ---', locationLink)
        }
    }

    function onOpenPhone(phoneNo) {

        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${phoneNo}`;
        } else {
            phoneNumber = `telprompt:${phoneNo}`;
        }
        try {
            // Linking.openURL(phoneNumber)
            //     .catch(alert('Sorry, can not open phone'))

            Linking.openURL(phoneNumber)
                .catch(warningPopUp("Sorry, can not open phone", dark))


        }
        catch (err) {
            // alert('Sorry, can not open phone')
            Linking.openURL(phoneNumber)
                .catch(warningPopUp("Sorry, can not open phone", dark))
        }
        // Linking.canOpenURL(`tel:${phoneNo}`)
        // .then(supported => {
        //     if (!supported) {
        //         alert('Sorry, can not open url')
        //     } else {
        //         return Linking.openURL(`tel:${phoneNo}`)
        //     }
        // })
        // .catch(alert('Sorry, can not open phone'))
    }

    function renderLocationPorts(item, index) {
        return (
            <ChargeType index={get(item, 'MachineConnectorNo', '')} dark={dark}
                style={{ borderWidth: selectedIndex == index ? 2 : 1, borderColor: selectedIndex == index ? dark ? colors.GREEN.secondary : '#3D5B59' : dark ? 'rgba(0,0,0,0.25)' : colors.GREEN.secondary }}
                title={get(item, 'MachineTitle', '')}
                label={get(item, 'VehicleConnectorName', '')}
                cost={get(item, 'VehicleConnectorText', '')}
                available={get(item, 'Availability', '')}
                onPress={() => onConnectorSelect(item, index)} />
        )
    }

    return (
        <RootContainer>
            <StickyHeader {...props} headerTitle="Location Info" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingTop: hp(4.5), paddingBottom: hp(4.5) }} style={{ backgroundColor: dark ? '#0E2831' : '#FFF' }}>
                <View style={[globalStyle.rowContainerCentered, { paddingHorizontal: wp(5) }]}>
                    <View style={{ overflow: 'hidden', borderRadius: 4 }}>
                        <Image style={{ height: wp('25%'), width: wp('25%') }} source={{ uri: get(chargingLocInfo[0], 'ImgUrl', null) }} />
                        {/* <ChargingPoint /> */}
                        {/* <View style={{ borderRadius: 4, height: hp(14), width: wp(25) }}>
                    <Image source={{ uri: get(chargingLocInfo, 'Image', '') }} style={{ width: '100%', height: '100%'}} resizeMode='cover' />
                </View> */}
                    </View>
                    <View style={{ paddingLeft: wp(3.5) }}>
                        <StyledText font='medium' size={18} color={dark ? '#FFF' : '#0A0A26'}>{get(chargingLocInfo[0], 'LocationName', '')}</StyledText>
                        <View style={[globalStyle.rowContainerCentered, { marginTop: 4 }]}>
                            <StyledText font='light' size={14} color={get(chargingLocInfo[0], 'Status', false) ? colors.GREEN.secondary : dark ? '#FFF' : '#0A0A26'}>Open </StyledText>
                            <StyledText font='light' size={14} color={get(chargingLocInfo[0], 'Status', false) ? dark ? '#FFF' : '#0A0A26' : colors.RED.primary}> Closing at </StyledText>
                            <StyledText font='light' size={14} color={dark ? '#FFF' : '#0A0A26'}>{minToHH(get(chargingLocInfo[0], 'CloseTime', 0))}</StyledText>

                        </View>
                        <View style={[globalStyle.rowContainerCenteredSpaced, { marginTop: 8, overflow: 'hidden' }]}>
                            <TouchableOpacity style={[globalStyle.rowContainerCentered, { marginRight: 10 }]} onPress={() => onAddFavorite()}>
                                {isLocationFav ?
                                    <Ionicons name='bookmark' size={16} color={dark ? '#FFF' : colors.GREEN.secondary} />
                                    :
                                    <Ionicons name='bookmark-outline' size={16} color={dark ? '#FFF' : colors.GREEN.secondary} />
                                }
                                {/* <Feather name='bookmark' size={16} color={dark ? '#FFF' : colors.GREEN.secondary} /> */}
                                <StyledText style={{ marginLeft: wp(1) }} font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>Favorite</StyledText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[globalStyle.rowContainerCentered, { marginRight: 10 }]} onPress={() => onReportChargingLocation()}>
                                <Feather name='message-square' size={16} color={dark ? '#FFF' : colors.GREEN.secondary} />
                                <StyledText style={{ marginLeft: wp(1) }} font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>Report</StyledText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[globalStyle.rowContainerCentered, { marginRight: 10 }]} onPress={() => onOpenPhone(get(chargingLocInfo[0], 'Vendor.PhoneNumber', ''))}>
                                <Feather name='phone' size={16} color={dark ? '#FFF' : colors.GREEN.secondary} />
                                <StyledText style={{ marginLeft: wp(1) }} font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>Contact</StyledText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {get(chargingLocInfo[0], 'Note', null)
                    ?
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 6, paddingLeft: 8, paddingVertical: 16, paddingRight: wp(15), marginHorizontal: wp(5), marginTop: hp(3) }}>
                        <Image source={require('../../../assets/icons/battery-low.png')} />
                        <StyledText style={{ marginLeft: 8 }} font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>Note : {get(chargingLocInfo[0], 'Note', null)}</StyledText>
                    </View> : null
                }


                <SafeAreaView style={{ paddingHorizontal: wp(5) }}>
                    <StyledText style={{ marginTop: hp(2) }} font='medium' size={18} color={dark ? '#FFF' : '#0A0A26'}>Available Ports</StyledText>

                    <View style={{ flexGrow: 1, marginTop: hp(1.5) }}>
                        <FlatList
                            data={get(chargingLocInfo[0], 'connector', [])}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => renderLocationPorts(item, index)}
                        />
                    </View>

                </SafeAreaView>

                <View style={[globalStyle.rowContainerCenteredSpaced, { paddingHorizontal: wp(5), marginTop: hp(3) }]}>
                    <View>
                        <StyledText font='light' size={15} color={dark ? '#FFF' : '#0A0A26'}></StyledText>
                        <StyledText font='light' size={13} color={dark ? '#FFF' : '#0A0A26'}></StyledText>
                    </View>
                    <View style={[globalStyle.rowContainerCentered]}>
                        <TouchableOpacity style={[globalStyle.centeredContent, { elevation: dark ? 0 : 2, borderRadius: 8, backgroundColor: dark ? '#263E46' : '#FFF', height: hp(5.4), width: hp(5.4) }]}
                            onPress={() => onShareLocation(chargingLocInfo[0])}>
                            <Feather name='share-2' size={24} color={dark ? '#FFF' : colors.GREEN.secondary} />
                        </TouchableOpacity>
                        <View style={[globalStyle.centeredContent, globalStyle.rowContainerCentered, { elevation: dark ? 0 : 2, borderRadius: 8, backgroundColor: dark ? '#263E46' : '#FFF', height: hp(5.4), paddingHorizontal: 10, marginLeft: 10 }]}>
                            <ArrowRight />
                            <TouchableOpacity style={{ paddingLeft: 12 }} onPress={() => redirectToNativeMap(get(chargingLocInfo[0], 'LongLat', ''))}>
                                {/* <StyledText font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>2KM</StyledText> */}
                                <StyledText font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>Get Direction</StyledText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <StyledText style={{ marginHorizontal: wp(5), marginBottom: hp(3), marginTop: hp(2) }} font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>{get(chargingLocInfo[0], 'Address', '')}</StyledText>
                <View style={{ height: 0.5, width: '100%', backgroundColor: 'rgba(255,255,255,0.1)' }} />

                <View style={{ paddingHorizontal: wp(5), paddingVertical: hp(3) }}>
                    <StyledText font='medium' size={18} color={dark ? '#FFF' : '#0A0A26'}>Amenities</StyledText>
                    <View style={[globalStyle.rowContainerCentered, { backgroundColor: dark ? 'transparent' : '#fff', marginTop: hp(1.5), justifyContent: "flex-start" }]}>
                        {
                            amenities.map(item => {
                                return (
                                    <View style={{ marginRight: 10 }}>
                                        <View style={[styles.amenityContainer, { backgroundColor: dark ? 'rgba(255,255,255,0.1)' : '#FFF', elevation: dark ? 0 : 4 }]}>
                                            {/* <Feather name='wifi' size={24} color={dark ? '#FFF' : colors.GREEN.secondary} /> */}
                                            <Image source={{ uri: get(item, 'ImageUrl', '') }} style={{ height: '50%', width: '50%', tintColor: dark ? '#FFF' : '#000'}} resizeMode='contain' />
                                        </View>
                                        <StyledText style={{ marginTop: hp(0.5), textAlign: 'center' }} font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>{get(item, 'name', '')}</StyledText>
                                    </View>
                                )
                            })
                        }
                        {/* <View style={{ marginRight: 10 }}>
                        <View style={[styles.amenityContainer, { backgroundColor: dark ? 'rgba(255,255,255,0.1)' : '#FFF', elevation: dark ? 0 : 4 }]}>
                            <Feather name='wifi' size={24} color={dark ? '#FFF' : colors.GREEN.secondary} />
                        </View>
                        <StyledText style={{ marginTop: hp(0.5), textAlign: 'center' }} font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>Wifi</StyledText>
                    </View>
                    <View style={{ marginRight: 10 }}>
                        <View style={[styles.amenityContainer, { backgroundColor: dark ? 'rgba(255,255,255,0.1)' : '#FFF', elevation: dark ? 0 : 4 }]}>
                            <Feather name='coffee' size={24} color={dark ? '#FFF' : colors.GREEN.secondary} />
                        </View>
                        <StyledText style={{ marginTop: hp(0.5), textAlign: 'center' }} font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>Coffee</StyledText>
                    </View>
                    <View style={{ marginRight: 10 }}>
                        <View style={[styles.amenityContainer, { backgroundColor: dark ? 'rgba(255,255,255,0.1)' : '#FFF', elevation: dark ? 0 : 4 }]}>
                            <MaterialIcon name='silverware-fork-knife' size={24} color={dark ? '#FFF' : colors.GREEN.secondary} />
                        </View>
                        <StyledText style={{ marginTop: hp(0.5), textAlign: 'center' }} font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>Restaurant</StyledText>
                    </View>
                    <View style={{ marginRight: 10 }}>
                        <View style={[styles.amenityContainer, { backgroundColor: dark ? 'rgba(255,255,255,0.1)' : '#FFF', elevation: dark ? 0 : 4 }]}>
                            <Feather name='shopping-bag' size={24} color={dark ? '#FFF' : colors.GREEN.secondary} />
                        </View>
                        <StyledText style={{ marginTop: hp(0.5), textAlign: 'center' }} font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>Shopping</StyledText>
                    </View>
                    <View>
                        <View style={[styles.amenityContainer, { backgroundColor: dark ? 'rgba(255,255,255,0.1)' : '#FFF', elevation: dark ? 0 : 4 }]}>
                            <MaterialIcon name='silverware-fork-knife' size={24} color={dark ? '#FFF' : colors.GREEN.secondary} />
                        </View>
                        <StyledText style={{ marginTop: hp(0.5), textAlign: 'center' }} font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>Restaurant</StyledText>
                    </View> */}
                    </View>
                </View>

                <View style={{ height: 0.5, width: '100%', backgroundColor: 'rgba(255,255,255,0.1)' }} />

                <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: wp(5) }}>
                    <Button label='Start Charging' onPress={() => onBookChargingSlot()} />
                </View>


            </ScrollView>
        </RootContainer>
    )
}

const styles = StyleSheet.create({
    amenityContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: wp(15.2),
        width: wp(15.2),
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
    }
})

export default BookChargingSlot;