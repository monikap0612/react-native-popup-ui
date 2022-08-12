import React from "react"
import { FlatList, SafeAreaView, Text, View, TouchableOpacity } from "react-native"
import { StickyHeader } from 'components';
import { useTheme } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';
import { map, get } from "lodash";
import { useSelector, useDispatch } from 'react-redux';

const routes = [
    {
        label: 'My Details',
        route: 'MyDetails',
        key: 1
    },
    {
        label: 'Notifications',
        route: 'Notifications',
        key: 2
    },
    // {
    //     label: 'Communication',
    //     route: 'Communication',
    //     key: 3
    // },
]

function navigateScreen(index, props) {

    // console.log("----index---", index);
    switch (index) {
        case 0:
            props.navigation.navigate('PersonalInfo')
            break;
        case 1:
            props.navigation.navigate('Notification')
            break;
        // case 2:
        //     props.navigation.navigate('')
            break;
    }
}

const Profile = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const { loginInfo, userInfo } = useSelector((state) => state.auth);

    return (
        <View style={{ flex: 1, backgroundColor: dark ? '#0E2831' : '#FFF', paddingBottom: hp(1) }}>
            <StickyHeader {...props} headerTitle="Profile" />
            <View style={[globalStyle.rowContainerCentered, { backgroundColor: dark ? '#102F3A' : '#F4F4F4', marginTop: 8, padding: 10, width: dark ? '97%' : '100%', alignSelf: 'center', paddingTop: dark ? 10 : hp(5), paddingBottom: dark ? 10 : hp(3) }]}>
                <View style={[globalStyle.centeredContent, { borderRadius: 50, backgroundColor: dark ? 'rgba(196, 196, 196, 0.23)' : colors.GREEN.secondary, height: 65, width: 65 }]}>
                    <Feather name='user' size={40} color={'#FFF'} />
                </View>
                <View style={{ paddingLeft: 14 }}>
                    <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.xRegular, color: dark ? '#FFF' : '#111' }}>My Profile</Text>
                    <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.ultraLight, color: colors.GREEN.secondary, marginTop: 1 }}>{get(userInfo, 'Email', '')}</Text>
                </View>
            </View>

            <SafeAreaView style={{ marginTop: dark ? hp(6.4) : hp(1) }}>
                <FlatList
                    data={routes}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity style={[globalStyle.rowContainerCenteredSpaced, {
                                paddingVertical: 24,
                                borderColor: dark ? 'rgba(255,255,255,0.2)' : '#CECECE', borderBottomWidth: 1, paddingHorizontal: wp(2)
                            }]} onPress={() => { navigateScreen(index, props) }}>
                                <Text style={[{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.big, color: dark ? '#FFF' : '#0a0a26' }]}>{item.label}</Text>
                                <Feather name='chevron-right' size={24} color={dark ? 'rgba(255,255,255,0.2)' : '#CECECE'} />
                            </TouchableOpacity>
                        )
                    }}
                />
            </SafeAreaView>
        </View>
    )
}

export default Profile;