import { useTheme } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    Image, ScrollView, StyleSheet, TextInput, TouchableWithoutFeedback, PermissionsAndroid,
    View, Linking, AppState, Text, FlatList, TouchableOpacity, Alert, Platform
} from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { colors, globalStyle, fonts, fontSizes } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ChargeType, Button, StyledText } from 'components';
import SlidersDark from '../../../assets/icons/sliders-dark.svg';
import SlidersLight from '../../../assets/icons/sliders-light.svg';
import InfoDark from '../../../assets/icons/info-dark.svg';
import InfoLight from '../../../assets/icons/info-light.svg';
import QrDark from '../../../assets/icons/qr-code-dark.svg';
import QrLight from '../../../assets/icons/qr-code-light.svg';
import Location from '../../../assets/icons/location-light.svg';
import ArrowRight from '../../../assets/icons/arrow-right.svg';
import AvailableMarker from '../../../assets/icons/available-marker.svg';
import OccupiedMarker from '../../../assets/icons/occupied-marker.svg';
import UnavailableMarker from '../../../assets/icons/unavailable-marker.svg';
import UnknownMarker from '../../../assets/icons/unknown-marker.svg';
import GetLocation from 'react-native-get-location';
import Geolocation from 'react-native-geolocation-service';
import Modal from "react-native-modal";
import SimpleCustomAlert from "components/CustomAlert";
import auth from '@react-native-firebase/auth';
import { getLocationLink } from 'firebaseAction/dynamicLinks';
import { setIsUpdateAvailable, setExpiredUserToken, userLogout } from "reduxStore/actions/auth";
import { setNotificationData } from "reduxStore/actions/notification";
import { lightMapStyle, mapStyle } from "styleConfig/mapStyle";
import { useEffect } from "react";

import { useSelector, useDispatch } from 'react-redux';
import { setHomeDetails, setUserCurrentLocation } from 'reduxStore/actions/home';

import UserService from "networkServices/UserService";
import ChargingService from 'networkServices/ChargingService';
import { showHUD, hideHUD } from 'utils/loader';
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';
import { map, get, flatten, isEmpty, size, first, last, omit } from "lodash";

import RNLocation from 'react-native-location';
import { redirectToMap, backgroundRecallThreshold, shareLocationInvite, warningPopUp } from 'utils/Common';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { URL, URLSearchParams } from 'react-native-url-polyfill';

import client from 'networkServices/HttpClient'
import EnvironmentStore from "utils/EnvironmentStore";
import axios from 'axios'
import Toast from 'react-native-simple-toast';
import { FloatingAction } from "react-native-floating-action";

// import backgroundTimerService from 'service/backgroundTimerService';
import BackgroundTimer from 'react-native-background-timer';
import { resetChargingRedux, markAsCompleteCharge } from 'reduxStore/actions/charging';

import Connector1 from 'assets/images/connector1.svg';
import Connector2 from 'assets/images/connector2.svg';
import Connector3 from 'assets/images/connector3.svg';
import Connector4 from 'assets/images/connector4.svg';

import LightConnector1 from 'assets/images/connector1-green.svg';
import LightConnector2 from 'assets/images/connector2-green.svg';
import LightConnector3 from 'assets/images/connector3-green.svg';
import LightConnector4 from 'assets/images/connector4-green.svg';

import chargingIndicatorIcon_light from 'assets/images/charging_indicator.png';
import chargingIndicatorIcon_dark from 'assets/images/charging_indicator_dark.png'

import BookChargingSlot from 'screens/HomeStack/BookChargingSlot';

const isIOS = Platform.OS === 'ios';

RNLocation.configure({
    distanceFilter: 5.0,
})

const Home = (props) => {

    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const dispatch = useDispatch();
    const ref = useRef(null);
    let mapViewRef = useRef(null);

    const element = ref.current;

    const actions = [
        {
            text: "Charging",
            icon: dark ? chargingIndicatorIcon_dark : chargingIndicatorIcon_light,
            name: "bt_charging",
            position: 1,
            color: "#fff",
            tintColor: null,
            iconColor: 'red'
        }
    ];

    const [region, setRegion] = useState({
        latitude: 22.878053651564056,
        longitude: 79.09302285911316,
        latitudeDelta: 12.0000,
        longitudeDelta: 12.0000,
    });

    const { loginInfo, deviceFCMToken, isUpdateAvailable } = useSelector((state) => state.auth);
    const { connectorInfo, verifiedCharging, startChargingInfo, isChargeComplete } = useSelector((state) => state.charging);
    const { userCurrentLocation } = useSelector((state) => state.home);

    const [markers, setMarkers] = useState([])
    const [userLocation, setUserLocation] = useState([]);
    const [helpVisible, setHelpVisible] = useState(false);
    const [sheetIndex, setSheetIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isHavePermission, setHavePermission] = useState(false);
    const [searchLocationsData, setSearchLocationsData] = useState([]);
    const [selectedLocationInfo, setSelectedLocationInfo] = useState(null);
    const [isFullScreenBottomSheet, setFullScreenBottomSheet] = useState(false);
    const [isLocationFav, setLocationFav] = useState(false);

    // ref
    const bottomSheetRef = useRef(null);

    // variables
    const snapPoints = useMemo(() => ['25%', '64%', '100%'], []);

    const longLeg = [
        { name: "LongLat", data: "[77.391029,28.535517]" },
    ]

    // callbacks
    const handleSheetChanges = useCallback((index) => {
        if (index > 1) {
            setFullScreenBottomSheet(true);
        } else {
            setFullScreenBottomSheet(false);
        }
        console.log('handleSheetChanges', index);
    }, []);

    const onChargingLocationInfo = async (element) => {
        let isConnected = await checkInternet();
        if (isConnected) {
            const chargingInfoPayload = {
                loginInfo,
                apiBody: [
                    { name: "LocationID", data: get(element, '_id', null) },
                ]
            }
            showHUD();
            const chargingInfo = await ChargingService.requestChargingLocationInfo(chargingInfoPayload);
            hideHUD();
            if (isGetSuccessData(chargingInfo)) {
                const locationInfo = first(get(chargingInfo, 'data.chargingLocation', []));
                setSelectedLocationInfo(locationInfo)
                setLocationFav(get(locationInfo, 'is_favorite', false));
                setSheetIndex(1);
                bottomSheetRef.current.present()
            } else {
                apiFallBackAlert(chargingInfo, dark);
            }
        } else {
            showInternetLostAlert(() => {
                onChargingLocationInfo();
            });
        }
    }

    const handleOpenPress = (element) => {
        onChargingLocationInfo(element)

    }

    const handleClosePress = () => {
        setSheetIndex(0);
        bottomSheetRef.current.dismiss()
    }

    const handleChargePress = (item) => {
        handleClosePress();
        props.navigation.navigate('BookChargingSlot', {
            locationData: item
        })
    }

    const getMarkerImage = (status) => {
        switch (status) {
            case 0: // unavailable
                return <UnavailableMarker />
            case 1: // Available
                return <AvailableMarker />
            case 2: // Occupied
                return <OccupiedMarker />
            case 3: // Unknown
                return <UnknownMarker />
            default:
                return <AvailableMarker />
        }
    }

    async function getNotificationData() {
        const notificationData = await UserService.getNotificationList(loginInfo);
        if (isGetSuccessData(notificationData)) {
            let notification_Data = get(notificationData, 'data', '')
            let validateNotificationData = get(notification_Data, 'NotificationList', '');
            const mapNotificationListData = map(validateNotificationData, (el) => {
                return { ...el, isExpanded: get(el, 'StatusRead', false) == false ? false : true }
            })

            let mapNotificationData = {
                ...omit(notification_Data, 'NotificationList'),
                NotificationList: mapNotificationListData
            }

            dispatch(setNotificationData(mapNotificationData))
        }
    }

    function backgroundTimerService() {
        BackgroundTimer.runBackgroundTimer(() => {
            getNotificationData();
        }, (backgroundRecallThreshold * 60000)); // recall time in second
    }

    function tempChangeForToken() {
        dispatch(setExpiredUserToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZDI0ZWFjNjJmYTc0YzQ2OTk1MzQyZiIsImlhdCI6MTY1Nzk0OTg2OCwiZXhwIjoxNjU3OTQ5OTExfQ.cYv82VHaC1t8GaKnCWS5TxA4cyyf1I2rMKCy0GHDz38'))
    }

    useEffect(() => {
        BackgroundTimer.start();
        getNotificationData();
        backgroundTimerService();
        redirectToCharging();
        // tempChangeForToken();
        getUserCurrentLocation();
        // getHomePageData();
        setFocusListener();
        // AppState.addEventListener('change', getUserCurrentLocation);
        // return () => {
        //     AppState.removeEventListener('change', getUserCurrentLocation)
        // }
        dynamicLinks()
            .getInitialLink()
            .then((link) => {
                handleDynamicLink(link);
            });

        const unsubscribe = dynamicLinks().onLink((link) => handleDynamicLink(link));
        return () => unsubscribe();
    }, [])

    const handleDynamicLink = link => {
        // Handle dynamic link inside your own application
        const { navigate, reset } = props.navigation;

        // console.log('--- handleDynamicLink ---', link)

        if (get(link, 'url', null) != null) {

            const url = new URL(get(link, 'url', null));
            const urlParams = new URLSearchParams(url.search);
            const locationId = urlParams.get("locationId");

            // let locationId = last(get(link, 'url', null).split('='))
            // console.log("---locationId---", locationId)

            const locationData = {
                "_id": locationId
            }
            props.navigation.navigate('BookChargingSlot', { locationData: locationData })
        }

    };

    function redirectToCharging() {
        const { navigate } = props.navigation;

        if (isChargeComplete) {
            dispatch(resetChargingRedux())
        } else {
            if (!isEmpty(startChargingInfo)) {
                navigate('Charging', { fromScreen: 'Home' })
            }
        }

    }

    function setFocusListener() {
        let focusSubscription = props.navigation.addListener(
            'focus',
            payload => {
                getUserCurrentLocation();
                getHomePageData();
            }
        );
    }

    useEffect(() => {
        requestLocationPermissions();
        getHomePageData();
    }, [])

    const requestLocationPermissions = async () => {
        if (Platform.OS === 'ios') {
            // iOS can be asked always, since the OS handles if user already gave permission
            await Geolocation.requestAuthorization('whenInUse');
        } else if (Platform.OS === 'android') {
            let permissionCheck = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            // Only asks for permission on Android if not given before
            if (permissionCheck !== true) {
                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission Request',
                        message:
                            'This app needs you permission for using your location for querying GeoPoints in Parse!',
                        buttonPositive: 'OK',
                    },
                );
            }
        }
    };

    async function getUserCurrentLocation() {
        if (Platform.OS === 'ios') {
            // iOS can be asked always, since the OS handles if user already gave permission
            let permissionCheck = await Geolocation.requestAuthorization('whenInUse');
            if (permissionCheck == 'granted') {
                setHavePermission(true);
                _getLocation();
            }
        } else if (Platform.OS === 'android') {
            let permissionCheck = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            // Only asks for permission on Android if not given before
            if (permissionCheck !== true) {
                const isHavePermission = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission Request',
                        message:
                            'This app needs you permission for using your location for querying GeoPoints in Parse!',
                        buttonPositive: 'OK',
                    },
                );

                setHavePermission(true);
                _getLocation();
            } else {
                setHavePermission(true);
                _getLocation();
            }
        }
    }

    const onUserLogout = async () => {
        const { reset } = props.navigation;
        await auth().signOut();
        dispatch(userLogout());
        reset({
            index: 0,
            routes: [{ name: 'Auth' }]
        })
    }

    const sessionExpireAlert = () => {

    }
    // Alert.alert(
    //     "Session Expire!!",
    //     "Your login session is expired please login agin to connect with system.",
    //     [
    //         { text: "OK", onPress: () => onUserLogout() }
    //     ]
    // );

    async function getHomePageData() {
        // let isConnected = await checkInternet();
        // if (isConnected) {
        showHUD();
        // console.log('---- loginInfo ---', userLocation)
        let homeDetailPayload = null;
        if (isHavePermission) {
            homeDetailPayload = {
                "LongLat": `[${get(userLocation, 'longitude', '77.391029')}, ${get(userLocation, 'latitude', '28.535517')}]`
            }
        } else {
            homeDetailPayload = {
                "LongLat": "[77.391029,28.535517]"
            }
        }
        // const homeDetailPayload = {
        //     "LongLat": "[77.391029,28.535517]"
        // }

        // const homePageData = await tempAPI(loginInfo, JSON.stringify(homeDetailPayload))
        const homePageData = await UserService.getHomePageDetails(loginInfo, JSON.stringify(homeDetailPayload));
        console.log('--- homePageData ---', homePageData)
        // const homePageData = await tempAPI(loginInfo, JSON.stringify(homeDetailPayload));
        hideHUD();
        if (get(homePageData, 'statusCode', 400) === 200) {
            const getHomePageData = get(homePageData, 'data');


            dispatch(setHomeDetails(getHomePageData));
            const mapHomePageData = map(get(getHomePageData, 'station', ''), (data) => {

                return [{
                    title: '',
                    description: '',
                    coordinate: {
                        latitude: last(get(data, 'LongLat', [])),
                        longitude: first(get(data, 'LongLat', []))
                    },
                    ...data
                }]
            });

            setMarkers(flatten(mapHomePageData))

            if (get(getHomePageData, 'updateFlag', 0) == 1) {
                if (isUpdateAvailable == false) {
                    dispatch(setIsUpdateAvailable(true))
                    setModalVisible(false);
                    setIsVisible(true)
                }
                else {
                    setModalVisible(false);
                    setIsVisible(false)
                }
            } else if (get(getHomePageData, 'updateFlag', 0) == 2) {
                setModalVisible(true);
                setIsVisible(false)
            }
        } else {
            const statusCode = get(homePageData, 'statusCode', 400);
            if (statusCode === 401) {
                sessionExpireAlert();
            }
        }


        // } else {
        //     showInternetLostAlert(() => {
        //         getHomePageData();
        //     });
        // }
    }

    const _getLocation = async () => {
        await Geolocation.getCurrentPosition(position => {
            const region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.012,
                longitudeDelta: 0.01
            };

            setUserLocation(region)
            const userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }
            dispatch(setUserCurrentLocation(userLocation));
            // mapViewRef.current?.animateToRegion(region, 500);
        }, error => { console.log('Location set- Error--', error) }, { enableHighAccuracy: true, maximumAge: 3600000, });
    };

    const onCurrentLocation = () => {
        mapViewRef.current?.animateToRegion(userLocation, 500);
    }

    async function onSearchLocation(searchText) {
        if (searchText.length >= 3) {
            const Obj = [
                { name: "Query", data: searchText },
                { name: "LongLat", data: "[77.391029,28.535517]" }
            ];

            let isConnected = await checkInternet();
            if (isConnected) {
                showHUD();
                const searchList = await UserService.searchCharginLocation(loginInfo, Obj);
                hideHUD();
                if (isGetSuccessData(searchList)) {
                    setSearchLocationsData(get(searchList, 'data', ''))
                } else {
                    apiFallBackAlert(searchList, dark)
                }
            }
            else {
                showInternetLostAlert(() => {
                    onSearchLocation()
                });
            }
        }
    }

    async function onAddFavorite(locationId) {
        const Obj = {
            LocationID: locationId,
            Toggle: true
        }

        let isConnected = await checkInternet();
        if (isConnected) {
            const addFavLocation = await UserService.addFavChargingLocations(loginInfo, JSON.stringify(Obj));
            if (isGetSuccessData(addFavLocation)) {
                Toast.show('Successfully mark as favorite', Toast.LONG);
                setLocationFav(!isLocationFav);
            }
            else {
                apiFallBackAlert(addFavLocation, dark)
                // let title = "Message";
                // let description = get(addFavLocation, 'message', 'Something went wrong');
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

    function onOpenSetting() {
        Linking.openURL('app-settings:')
    }

    function onModalClose() {
        setModalVisible(false)
    }

    function onModal2Close() {
        setIsVisible(false)
    }

    function connectorImageByType(type) {
        if (dark) {
            switch (type) {
                case 1:
                    return <Connector1 width="40" />
                case 2:
                    return <Connector2 width="40" />
                case 3:
                    return <Connector3 width="40" />
                case 4:
                    return <Connector4 width="40" />

                default:
                    return <Connector1 width="40" />
            }
        } else {
            switch (type) {
                case 1:
                    return <LightConnector1 width="50" />
                case 2:
                    return <LightConnector2 width="50" />
                case 3:
                    return <LightConnector3 width="50" />
                case 4:
                    return <LightConnector4 width="50" />

                default:
                    return <LightConnector1 width="50" />
            }
        }
    }

    function renderSelectedLocationPorts(item, index) {
        const connectorType = get(item, 'MachineConnectorNo', 1);
        return (
            <View style={{ marginLeft: wp(3), width: wp(22), marginRight: wp(3), flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                {connectorImageByType(connectorType)}
                <View style={{ marginTop: 8, alignItems: "center" }}>
                    <Text style={{ color: dark ? "#fff" : "#000" }}>{get(item, 'VehicleConnectorName', '')}</Text>
                    <Text numberOfLines={1} style={{ color: dark ? "#fff" : "#000", }}>{get(item, 'VehicleConnectorText', '')}</Text>
                    {/* <Text style={{ color: dark ? "#fff" : "#000", fontSize: 14 }}>{get(item, 'VehicleConnectorName', '')}</Text> */}
                    <Text style={{ color: dark ? "#fff" : "#000", fontWeight: "bold" }}>{get(item, 'Availability', '') == 0 ? 'Unavailable' : 'Available'}</Text>
                </View>

                {/* <View>
                    <Text style={{ color: dark ? "#fff" : "#000", fontSize: 14 }}>{get(item, 'VehicleConnectorName', '')}</Text>
                    <Text style={{ color: dark ? "#fff" : "#000", }}>{get(item, 'VehicleConnectorText', '')}</Text>
                </View>
                <View style={{ alignSelf: "center" }}>
                    <Text style={{ color: dark ? "#fff" : "#000" }}>{get(item, 'Availability', '') == 0 ? 'Unavailable' : 'Available'}</Text>
                </View> */}

            </View>
        )
    }

    function renderSeparatorComponent() {
        return (
            <View style={styles.verticleLine}></View>
        )
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

    function renderSearchLocation(item, index) {
        const isLastItem = index === (size(searchLocationsData) - 1)

        return (
            <TouchableOpacity activeOpacity={0.7} style={{ flex: 1 }} onPress={() => { props.navigation.navigate('BookChargingSlot', { locationData: item }) }}>
                <Text style={[styles.searchLocationLabelText, { color: dark ? '#fff' : '#000' }]}>{item.LocalAreaName}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.searchLocationDescText, { color: dark ? '#fff' : '#000' }]}>{item.Address}</Text>
                </View>
                {!isLastItem && (
                    <View style={{ height: 0.5, marginTop: 8, marginBottom: 5, width: '100%', backgroundColor: dark ? '#fff' : '#000' }}></View>
                )}
            </TouchableOpacity>
        )
    }

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
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ position: 'absolute', flexDirection: 'row', top: 30, left: 20, right: 20, zIndex: 999 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF', height: 50, borderRadius: 50, paddingHorizontal: 16 }}>
                    <TextInput placeholder="Search location" placeholderTextColor={dark ? '#FFF' : '#000'}
                        style={{ flex: 1, fontFamily: fonts.MULISH.light, fontSize: fontSizes.regular, color: dark ? '#fff' : '#000' }}
                        onChangeText={(text) => onSearchLocation(text)} />
                    {/* <TouchableWithoutFeedback onPress={() => { props.navigation.navigate('Filter') }}>
                        {
                            dark ?
                                <SlidersLight />
                                :
                                <SlidersDark />
                        }
                    </TouchableWithoutFeedback> */}
                </View>
                <TouchableWithoutFeedback onPress={() => { setHelpVisible(true) }}>
                    <View style={[styles.circle, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF' }]}>
                        {
                            dark ?
                                <InfoLight />
                                :
                                <InfoDark />
                        }
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { props.navigation.navigate('ScanScreen') }}>
                    <View style={[styles.circle, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF' }]}>
                        {
                            dark ?
                                <QrLight />
                                :
                                <QrDark />
                        }
                    </View>
                </TouchableWithoutFeedback>
            </View>
            {!isHavePermission && (
                <View style={{
                    right: 20, left: 20, backgroundColor: '#94C973', marginTop: 88,
                    position: "absolute", flexDirection: "row", padding: 10, borderWidth: 1, borderRadius: 15,
                    borderColor: '#8294B9'
                }}>
                    <Image source={require('assets/images/warning.png')} style={{
                        tintColor: '#2F5233',
                        height: 35,
                        width: 35,
                        alignSelf: 'center'
                    }} />
                    {/* <FontAwesome name='exclamation-circle' size={35} color={'#2F5233'} style={{ alignSelf: "center" }} /> */}
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={{ fontSize: 20, lineHeight: 30 }}>Allow permission!</Text>
                        <Text style={{ fontSize: 14 }}>please allow location permission to identify charging station near you.</Text>
                    </View>
                    <View style={{ width: '20%', alignSelf: "center", marginLeft: 8 }}>
                        <TouchableWithoutFeedback onPress={() => onOpenSetting()}>
                            <View style={[globalStyle.centeredContent, { borderRadius: 90, backgroundColor: '#2F5233', height: hp(5.4), width: '100%', padding: 5 }, props.style]}>
                                <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.semiExtraBig, textAlign: 'center', color: '#FFF', fontWeight: "bold" }]}>Allow</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            )}

            {!isEmpty(searchLocationsData) && (
                <FlatList style={[styles.searchListContainer, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF' }]}
                    contentContainerStyle={{ paddingBottom: 25 }}
                    data={searchLocationsData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => renderSearchLocation(item, index)}
                />
            )}




            {
                // sheetIndex === 0 &&
                <View style={[{ position: 'absolute', flexDirection: 'row', bottom: hp(12.5), right: 20, height: 40, width: 160, borderRadius: 50, backgroundColor: dark ? '#002931' : '#FFF', zIndex: 10, overflow: 'hidden' }]}>
                    <TouchableWithoutFeedback onPress={() => { props.navigation.navigate('FindCharge') }}>
                        <View style={[globalStyle.centeredContent, { flex: 1 }]}>
                            <Feather name='list' size={24} color={dark ? '#FFF' : '#111'} />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => onCurrentLocation()}>
                        <View style={[globalStyle.centeredContent, { flex: 1, backgroundColor: colors.GREEN.secondary }]}>
                            <Location />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            }
            <BottomSheetModal
                ref={bottomSheetRef}
                style={{ marginHorizontal: isFullScreenBottomSheet ? 0 : wp(2.3) }}
                containerStyle={{ paddingHorizontal: 10 }}
                index={1}
                snapPoints={snapPoints}
                enableContentPanningGesture={isIOS ? true : false}
                onChange={handleSheetChanges}
                handleIndicatorStyle={{ backgroundColor: dark ? 'rgba(255,255,255,0.37)' : 'rgba(184, 184, 184,0.37)', width: 79 }}
                handleStyle={{ backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF', borderTopRightRadius: 12, borderTopLeftRadius: 12 }}
            >
                {isFullScreenBottomSheet
                    ? <>
                        <BookChargingSlot {...props} LocationID={get(selectedLocationInfo, '_id', [])} />
                    </>
                    :
                    <View showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF', paddingBottom: hp(3) }}>
                        <View style={{ paddingLeft: 26, paddingRight: 16, paddingVertical: 16 }}>
                            <View style={[globalStyle.rowContainerCenteredSpaced]}>
                                <StyledText font='medium' size={18} color={dark ? '#FFF' : '#0A0A26'}>{get(selectedLocationInfo, 'LocalAreaName', '')}</StyledText>
                                <TouchableOpacity onPress={() => onAddFavorite(get(selectedLocationInfo, '_id', false))}>
                                    {/* <Feather name='bookmark' size={30} color={dark ? '#FFF' : colors.GREEN.secondary} /> */}
                                    {isLocationFav ?
                                        <Ionicons name='bookmark' size={30} color={dark ? '#FFF' : colors.GREEN.secondary} />
                                        :
                                        <Ionicons name='bookmark-outline' size={30} color={dark ? '#FFF' : colors.GREEN.secondary} />
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={[globalStyle.rowContainerCentered]}>
                                <StyledText font='light' size={14} color={get(selectedLocationInfo, 'Status', false) ? colors.GREEN.secondary : dark ? '#FFF' : '#0A0A26'}>Open </StyledText>
                                <StyledText font='light' size={14} color={get(selectedLocationInfo, 'Status', false) ? dark ? '#FFF' : '#0A0A26' : colors.RED.primary}> Close </StyledText>
                                <StyledText font='light' size={14} color={dark ? '#FFF' : '#0A0A26'}>11:00 PM</StyledText>
                            </View>
                        </View>

                        <View style={{ height: 1, width: '100%', backgroundColor: 'rgba(255,255,255,0.06)' }} />

                        <StyledText style={{ marginLeft: wp(5), marginTop: hp(1) }} font='medium' size={18} color={dark ? '#FFF' : '#0A0A26'}>Available Ports</StyledText>

                        <View style={{ paddingTop: hp(2), paddingLeft: wp(5) }}>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={get(selectedLocationInfo, 'connector', [])}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => renderSelectedLocationPorts(item, index)}
                                ItemSeparatorComponent={() => renderSeparatorComponent()}
                            />
                        </View>

                        <View style={[globalStyle.rowContainerCenteredSpaced, { paddingHorizontal: wp(5), marginTop: hp(3) }]}>
                            <View>
                                <StyledText font='light' size={15} color={dark ? '#FFF' : '#0A0A26'}>Start</StyledText>
                                <StyledText font='light' size={13} color={dark ? '#FFF' : '#0A0A26'}>₹{get(selectedLocationInfo, 'priceperunit', 0)} Per Unit</StyledText>
                            </View>
                            <View style={[globalStyle.rowContainerCentered]}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => onShareLocation(selectedLocationInfo)}
                                    style={[globalStyle.centeredContent, { elevation: dark ? 0 : 2, borderRadius: 8, backgroundColor: dark ? '#263E46' : '#FFF', height: hp(5.4), width: hp(5.4) }]}>
                                    <Feather name='share-2' size={24} color={dark ? '#FFF' : colors.GREEN.secondary} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[globalStyle.centeredContent, globalStyle.rowContainerCentered, { elevation: dark ? 0 : 2, borderRadius: 8, backgroundColor: dark ? '#263E46' : '#FFF', height: hp(5.4), paddingHorizontal: 10, marginLeft: 10 }]}
                                    onPress={() => redirectToNativeMap(get(selectedLocationInfo, 'LongLat', null))}
                                >
                                    <ArrowRight />
                                    <View style={{ paddingLeft: 12 }}>
                                        {/* <StyledText font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>2KM</StyledText> */}
                                        <StyledText font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>Get Direction</StyledText>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <StyledText style={{ marginHorizontal: wp(5), marginBottom: hp(3), marginTop: hp(2) }} font='light' size={12} color={dark ? '#FFF' : '#0A0A26'}>{get(selectedLocationInfo, 'Address', '')},
                        </StyledText>
                        <View style={{ paddingHorizontal: wp(5), paddingBottom: hp(5) }}>
                            <Button label='Charge' onPress={() => { handleChargePress(selectedLocationInfo) }} />
                        </View>
                    </View>
                }
            </BottomSheetModal>

            {!isChargeComplete && !isEmpty(startChargingInfo) && (
                <FloatingAction
                    actions={actions}
                    position="left"
                    overrideWithAction
                    distanceToEdge={{
                        vertical: hp(12.5),
                        horizontal: 30
                    }}
                    iconHeight={wp('8%')}
                    iconWidth={wp('8%')}
                    buttonSize={wp('15%')}
                    color={dark ? '#002931' : '#FFF'}
                    iconColor={'#f0f'}
                    onPressItem={() => redirectToCharging()}
                />
            )}

            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => { handleClosePress() }}>
                <MapView
                    style={{ flex: 1, zIndex: -1 }}
                    region={region}
                    ref={mapViewRef}
                    customMapStyle={dark ? mapStyle : []}
                    onRegionChangeComplete={(region) => { setRegion(region) }}
                    userLocationAnnotationTitle={null}
                    toolbarEnabled={false}
                    moveOnMarkerPress={false}
                    followsUserLocation={true}
                    zoomEnabled={true}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    showsPointsOfInterest={true}
                >
                    {
                        markers.map((element, index) => {
                            const locationStatus = get(element, 'location_status', 1);
                            return (
                                <Marker
                                    onPress={() => { onChargingLocationInfo(element) }}
                                    onDeselect={() => { handleClosePress() }}
                                    key={index.toString()}
                                    // title={element.title}
                                    // description={element.description}
                                    coordinate={element.coordinate}
                                // pointerEvents={'auto'}
                                // tracksViewChanges={false}
                                // draggable
                                >
                                    {
                                        getMarkerImage(locationStatus)
                                    }
                                </Marker>
                            )
                        })
                    }
                </MapView>
            </TouchableWithoutFeedback>

            <Modal isVisible={helpVisible}>
                <View style={[styles.modal, { backgroundColor: dark ? '#112D38' : '#FFF' }]}>
                    <TouchableWithoutFeedback onPress={() => { setHelpVisible(false) }}>
                        <Feather style={{ alignSelf: 'flex-end' }} name='x' size={24} color={'#777'} />
                    </TouchableWithoutFeedback>
                    <View style={[globalStyle.rowContainerCentered]}>
                        <AvailableMarker />
                        <StyledText style={{ marginLeft: wp(5) }} font="regular" size={20} color={dark ? '#FFF' : '#0A0A26'}>Available</StyledText>
                    </View>
                    <View style={[globalStyle.rowContainerCentered, { marginTop: hp(3) }]}>
                        <OccupiedMarker />
                        <StyledText style={{ marginLeft: wp(5) }} font="regular" size={20} color={dark ? '#FFF' : '#0A0A26'}>Occupied</StyledText>
                    </View>
                    <View style={[globalStyle.rowContainerCentered, { marginTop: hp(3) }]}>
                        <UnavailableMarker />
                        <StyledText style={{ marginLeft: wp(5) }} font="regular" size={20} color={dark ? '#FFF' : '#0A0A26'}>Unavailable</StyledText>
                    </View>
                    <View style={[globalStyle.rowContainerCentered, { marginTop: hp(3) }]}>
                        <UnknownMarker />
                        <StyledText style={{ marginLeft: wp(5) }} font="regular" size={20} color={dark ? '#FFF' : '#0A0A26'}>Unknown</StyledText>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    circle: {
        height: 50,
        width: 50,
        borderRadius: 50,
        backgroundColor: colors.BLUEGREY.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    modal: {
        borderRadius: 5,
        paddingTop: hp(2),
        paddingBottom: hp(5),
        paddingHorizontal: wp(5)
    },
    searchListContainer: {
        right: 20,
        left: 20,
        marginTop: 88,
        position: "absolute",
        padding: 14,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#8294B9',
        maxHeight: hp('35%'),
    },
    searchLocationLabelText: {
        fontFamily: fonts.MULISH.bold,
        fontSize: 20,
    },
    searchLocationDescText: {
        fontFamily: fonts.MULISH.light,
        fontSize: 16,
        flexWrap: 'wrap'
    },
    verticleLine: {
        height: '80%',
        width: 1,
        backgroundColor: '#909090',
        alignSelf: "center"
    }
})

export default Home;