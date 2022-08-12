import React, { useEffect } from "react";
import { useTheme, useNavigation } from "@react-navigation/native";
import { Dimensions, Image, ScrollView, Text, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import { Button } from 'components';

import { useSelector, useDispatch } from 'react-redux';
import { updateUserWalletBalance } from 'reduxStore/actions/home';

const { height, width } = Dimensions.get('screen');

const Transaction = (props) => {
    // Gets the current theme. Dark or light
    const fromScreen = props.route?.params?.fromScreen;

    const navigation = useNavigation();
    const routes = navigation.getState().routeNames;

    const { dark } = useTheme();
    const dispatch = useDispatch();

    const { amount, currency, transactionId } = props.route.params;

    useEffect(() => {
        updateUserWallet();
    }, [])

    const updateUserWallet = () => {
        dispatch(updateUserWalletBalance(amount));
    }

    const handleTwiceNavigation = () => {
        setTimeout(() => {
            const handleRouting = props.route?.params?.handleRouting;
            if (fromScreen === 'ChargingInitialization') {
                props.navigation.goBack();
                props.navigation.goBack();
            } else {
                props.navigation.goBack();
            }
        }, 50);
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(12), paddingTop: hp(3), paddingHorizontal: wp(5) }} style={{ backgroundColor: dark ? '#0E2831' : '#FFF' }}>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.title, color: dark ? '#FFF' : '#111' }}>Complete</Text>

                <View style={[globalStyle.centeredContent, { borderRadius: 150, backgroundColor: colors.GREEN.secondary, width: width * 0.5, height: width * 0.5, marginTop: hp(3) }]}>
                    <Feather name='check' size={width * 0.35} color={'#FFF'} />
                </View>

                <Text style={{ fontFamily: fonts.MULISH.bold, fontSize: fontSizes.xTitle, marginTop: hp(3), color: dark ? '#FFF' : colors.GREEN.secondary }}>{currency} {amount}</Text>

                <View style={[globalStyle.rowContainerCentered, {
                    borderRadius: 6,
                    backgroundColor: dark ? '#0D252E' : '#FFF',
                    elevation: dark ? 0 : 4, padding: 9,
                    maxWidth: wp('90%'), marginTop: hp(4.5)
                }]}>
                    <View style={[globalStyle.centeredContent, { backgroundColor: dark ? '#003946' : '#f4f4f4', borderRadius: 8 }]}>
                        <Image source={require('../../../assets/images/zap.png')} />
                    </View>
                    <View style={{ flexWrap: 'wrap', flex: 1, paddingHorizontal: 18 }}>
                        <Text style={{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.header, color: dark ? '#FFF' : '#111' }}>Transaction ID</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontFamily: fonts.MULISH.light, flexWrap: 'wrap', fontSize: fontSizes.big, color: dark ? '#FFF' : '#111' }}>{transactionId}</Text>
                        </View>
                    </View>
                </View>

            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Button label='Done' onPress={() => handleTwiceNavigation()} />
                {/* <Button label='Done' onPress={() => { props.navigation.pop(2) }} /> */}
                {/* <Button label='Done' onPress={() => { props.navigation.reset({
                routes: [{ name: 'App',  state: {
                    routes: [{ name: 'ChargingInitialization' }]
                }, }]
            }) }} /> */}
            </View>

        </ScrollView>
    )
}

export default Transaction;