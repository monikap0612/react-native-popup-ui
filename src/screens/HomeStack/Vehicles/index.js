import React, { useState, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { Dimensions, FlatList, Image, SafeAreaView, ScrollView, StatusBar, Text, View, TouchableOpacity } from "react-native";
import { RootContainer, StickyHeader } from 'components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';
import TataDark from '../../../assets/images/tata-dark.svg';
import TataLight from '../../../assets/images/tata-light.svg';
import { useSelector, useDispatch } from 'react-redux';
import { saveUserVehicles } from 'reduxStore/actions/auth';
import UserService from "networkServices/UserService";
import { showHUD, hideHUD } from 'utils/loader';
import { isGetSuccessData, apiFallBackAlert, checkInternet } from "networkServices/networkHelper";
import { isEmpty, get } from 'lodash';

const { height, width } = Dimensions.get('screen');

const Vehicles = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const dispatch = useDispatch();

    const { loginInfo, deviceFCMToken, userVehicles } = useSelector((state) => state.auth);
    const [vehicalList, setVehicleList] = useState([])

    const [cars, setCars] = useState([
        {
            type: 'tata',
            name: 'NEXON EV',
            key: 1
        },
        {
            type: 'tata',
            name: 'TIGOR ZIPTRON',
            key: 2
        },
    ])

    const getImage = (type) => {
        if (dark) {
            switch (type) {
                case 'tata':
                    return <TataLight width={(width - 90) / 4} />;
            }
        } else {
            switch (type) {
                case 'tata':
                    return <TataDark width={(width - 90) / 4} />;
            }
        }
    }

    async function getVehicleData() {
        const isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const vehicleData = await UserService.getVehicleList(loginInfo);
            hideHUD();
            if (isGetSuccessData(vehicleData)) {
                let validateVehicleData = get(vehicleData, 'data', '');
                dispatch(saveUserVehicles(validateVehicleData));
            } else {
                apiFallBackAlert(vehicleData, dark)
            }
        }
        else {
            showInternetLostAlert(() => {
                getVehicleData();
            });
        }
    }

    useEffect(() => {
        getVehicleData();
    }, [])

    const onEditVehicleInfo = (item) => {
        const { navigate } = props.navigation;
        navigate('EditMyVehicle', {
            selectedVehicle: item
        })
    }

    return (
        <RootContainer>
            <View style={{ flexGrow: 1, backgroundColor: dark ? '#0E2831' : '#FFF' }}>
                <StickyHeader {...props} headerTitle="My Vehicles" />
                <View showsVerticalScrollIndicator={false} style={{ flexGrow: 1, marginTop: 8, backgroundColor: dark ? '#0E2831' : '#FFF' }}>

                    <StatusBar backgroundColor={colors.GREEN.secondary} barStyle='light-content' />
                    <View style={[globalStyle.rowContainerSpaced, { backgroundColor: dark ? colors.BLUEGREY.secondary : colors.GREEN.secondary }]}>
                        <View style={{ flex: 1, justifyContent: 'flex-end', padding: 20 }}>
                            <Text style={{ fontFamily: fonts.MULISH.bold, fontSize: fontSizes.title }}>MY{'\n'}VEHICLES</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: dark ? '#003946' : undefined, padding: hp(1) }}>
                            <Image style={{ width: '100%' }} resizeMode='contain' source={require('../../../assets/images/cars-charging.png')} />
                        </View>
                    </View>

                    <View style={{ flexGrow: 1, paddingHorizontal: 30, marginTop: hp(5) }}>
                        {userVehicles.length > 0 ?
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    data={[...userVehicles, { plusImage: true }]}
                                    contentContainerStyle={{ flexGrow: 1 }}
                                    numColumns={3}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => {
                                        if (item.plusImage) {
                                            return (
                                                <TouchableOpacity style={[globalStyle.centeredContent, {
                                                    elevation: dark ? 0 : 4, backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4',
                                                    borderRadius: 6, width: (width - 90) / 3, height: hp(22), marginVertical: 10,
                                                    paddingHorizontal: 5, justifyContent: "center"
                                                }]}
                                                    onPress={() => {
                                                        props.navigation.navigate('AddVehicle', {
                                                            fromVehicleScreen: true
                                                        })
                                                    }}
                                                >
                                                    <Feather name='plus' size={40} />
                                                </TouchableOpacity>
                                            );
                                        }
                                        return (
                                            <TouchableOpacity activeOpacity={0.7} onPress={() => onEditVehicleInfo(item)} style={{ height: hp(22), marginVertical: 10, elevation: dark ? 0 : 4, backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', borderRadius: 6, width: (width - 90) / 3, marginRight: 15, justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 8 }}>
                                                <Text style={{ fontFamily: fonts.OSWALD.medium, fontSize: fontSizes.semiExtraBig, textAlign: 'center', lineHeight: 20, marginBottom: get(item, 'VehicleModelName', '').length > 8 ? 0 : hp(2), color: dark ? '#FFF' : '#0A0A26' }}>
                                                    {get(item, 'VehicleModelName', '')}</Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </View>
                            :
                            <TouchableOpacity style={[globalStyle.centeredContent, {
                                elevation: dark ? 0 : 4, backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4',
                                borderRadius: 6, width: (width - 90) / 3, height: hp(22), marginVertical: 10,
                                paddingHorizontal: 5, justifyContent: "center"
                            }]}
                                onPress={() => {
                                    props.navigation.navigate('AddVehicle', {
                                        fromVehicleScreen: true
                                    })
                                }}
                            >
                                <Feather name='plus' size={40} />
                            </TouchableOpacity>
                        }
                    </View>



                </View>
            </View>
        </RootContainer>
    )
}

export default Vehicles;