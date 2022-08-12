import React, { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { Alert, Appearance, FlatList, SafeAreaView, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';
import { DarkModeToggle, RootContainer } from 'components';
import ThemeStore, { toggleDark, toggleLight } from "utils/ThemeStore";
import auth from '@react-native-firebase/auth';
import { map, get } from "lodash";

import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from 'reduxStore/actions/auth';
import { toggleDarkTheme, toggleLightTheme } from 'reduxStore/actions/theme';
import { Popup } from 'popup-ui';

const createThreeButtonAlert = () =>
    Alert.alert(
        "Log Out.",
        "are you sure logout this device .",
        [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            { text: "OK", onPress: () => auth().signOut() }
        ]
    );


const items = [
    {
        label: 'My Profile',
        icon: 'user',
        route: 'Profile',
        key: 1,
    },
    {
        label: 'Charging History',
        icon: 'file',
        route: 'ChargingHistory',
        key: 2,
    },
    {
        label: 'Transaction History',
        icon: 'book',
        route: 'TransactionHistory',
        key: 2,
    },
    {
        label: 'My Vehicles',
        icon: 'truck',
        route: 'Vehicles',
        key: 3,
    },
    // {
    //     label: 'Payment Methods',
    //     icon: 'credit-card',
    //     route: 'Payments',
    //     key: 4,
    // },
    {
        label: 'My Usage',
        icon: 'pie-chart',
        route: 'Usage',
        key: 4,
    },
    {
        label: 'Help & Support',
        icon: 'headphones',
        route: 'Help',
        key: 5,
    },
    {
        label: 'Log Out',
        icon: 'log-out',
        route: undefined,
        // function: () => createThreeButtonAlert(),
        key: 6,
    },
]

const AccountItem = (props) => {
    return (
        <TouchableWithoutFeedback onPress={() => { props.route != undefined ? props.navigation.navigate(props.route) : props.function() }}>
            <View style={[globalStyle.rowContainerCenteredSpaced, { paddingVertical: 20, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }]}>
                <View style={[globalStyle.rowContainerCentered, {}]}>
                    <Feather name={props.icon} size={32} color={props.dark ? 'rgba(255,255,255,0.2)' : colors.GREEN.secondary} />
                    <Text style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.big, marginLeft: 20, color: props.dark ? '#FFF' : '#0a0a26' }}>{props.label}</Text>
                </View>
                <Feather name='chevron-right' size={24} color={props.dark ? 'rgba(255,255,255,0.2)' : '#CECECE'} />
            </View>
        </TouchableWithoutFeedback>
    )
}

const Account = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const { isDarkTheme } = useSelector((state) => state.theme);

    const dispatch = useDispatch();

    const { loginInfo, userInfo, deviceFCMToken } = useSelector((state) => state.auth);
    const [darkMode, setDarkMode] = useState(ThemeStore.getState().dark);

    const handleThemeChange = (val) => {
        setDarkMode(val);

        if (val) {
            dispatch(toggleDarkTheme());
        } else {
            dispatch(toggleLightTheme());
        }
        // ThemeStore.dispatch(val ? toggleDark() : toggleLight());
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

    useEffect(() => {
        console.log(darkMode);
    })

    const createThreeButtonAlert = () => {
        Popup.show({
            type: 'Warning',
            title: "Log Out.",
            textBody: "are you sure logout this device .",
            buttonText: 'Ok',
            cancellable: true,
            // popUpBG: dark ? colors.BLUEGREY.secondary : '#3D413D',
            popUpBG: dark ? colors.BLUEGREY.secondary : '#E7E1E0',
            titleStyle: dark ? { color: '#C4AE78' } : {},
            descStyle: dark ? { color: '#F9F6F0' } : {},
            callback: () => {
                Popup.hide()
                onUserLogout()
            },
            cancelCallback: () => Popup.hide()
        })
    }
    // Alert.alert(
    //     "Log Out.",
    //     "are you sure logout this device .",
    //     [
    //         {
    //             text: "Cancel",
    //             onPress: () => console.log("Cancel Pressed"),
    //             style: "cancel"
    //         },
    //         { text: "OK", onPress: () => onUserLogout() }
    //     ]
    // );




    const AccountItem = (props) => {
        return (
            <TouchableWithoutFeedback onPress={() => { props.route != undefined ? props.navigation.navigate(props.route) : createThreeButtonAlert() }}>
                <View style={[globalStyle.rowContainerCenteredSpaced, { paddingVertical: 20, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }]}>
                    <View style={[globalStyle.rowContainerCentered, {}]}>
                        <Feather name={props.icon} size={32} color={props.dark ? 'rgba(255,255,255,0.2)' : colors.GREEN.secondary} />
                        <Text style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.big, marginLeft: 20, color: props.dark ? '#FFF' : '#0a0a26' }}>{props.label}</Text>
                    </View>
                    <Feather name='chevron-right' size={24} color={props.dark ? 'rgba(255,255,255,0.2)' : '#CECECE'} />
                </View>
            </TouchableWithoutFeedback>
        )
    }


    return (
        <RootContainer>
        <View showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(12), backgroundColor: '#f0f' }} style={{ flexGrow: 1, backgroundColor: dark ? '#0E2831' : '#FFF' }}>

            <View style={{ paddingTop: hp(5), paddingBottom: hp(4), backgroundColor: dark ? undefined : '#F4F4F4' }}>
                <View style={[globalStyle.rowContainerCentered, { backgroundColor: dark ? '#102F3A' : '#FFF', borderRadius: 50, padding: 10, width: '70%', alignSelf: 'center', elevation: dark ? 0 : 4 }]}>
                    <View style={[globalStyle.centeredContent, { borderRadius: 50, backgroundColor: dark ? 'rgba(196, 196, 196, 0.23)' : colors.GREEN.secondary, height: 65, width: 65 }]}>
                        <Feather name='user' size={40} color={'#FFF'} />
                    </View>
                    <View style={{ paddingLeft: 14 }}>
                        {/* <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.xRegular, color: dark ? '#FFF' : '#111' }}>Jayesh Mishra</Text>
                        <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.ultraLight, color: colors.GREEN.secondary, marginTop: 1 }}>jayeshmishra@gmail.com</Text> */}
                        <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.xRegular, color: dark ? '#FFF' : '#111' }}>{get(userInfo, 'Name', '')}</Text>
                        <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.ultraLight, color: colors.GREEN.secondary, marginTop: 1 }}>{get(userInfo, 'Email', '')}</Text>
                    </View>
                </View>

                <View style={{ position: 'absolute', top: hp(1), right: wp(2) }}>
                    <DarkModeToggle value={isDarkTheme} onChangeValue={(val) => { handleThemeChange(val) }} />
                </View>

            </View>

            <View style={{ marginTop: hp(1), paddingHorizontal: wp(5), flex: 1, marginBottom: hp(2)}}>
                <FlatList
                    data={items}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <AccountItem {...item} dark={dark} navigation={props.navigation} />
                        )
                    }}
                />
            </View>

        </View>
        </RootContainer>
    )
}

export default Account;