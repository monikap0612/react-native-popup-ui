import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';
import { Button } from 'components';
import MapView from "react-native-maps";
import mapStyle from "styleConfig/mapStyle";

const RoutePlanner = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const [region, setRegion] = useState({
        // latitude: 25.767513617808653,
        // longitude: -80.1951350571158,
        // latitudeDelta: 0.0922,
        // longitudeDelta: 0.0421,
        latitude: 28.537139210614427,
        longitude: 77.38607931083781,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [location, setLocation] = useState('');
    const [destination, setDestination] = useState('');

    return (
        <ScrollView contentContainerStyle={{ flex: 1, paddingTop: hp(4.5), paddingBottom: hp(1), paddingHorizontal: wp(5) }} style={{ backgroundColor: dark ? '#0E2831' : '#FFF' }}>
            <Text style={[{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.xExtraBig, color: dark ? '#FFF' : '#111' }]}>Hey Virendra,</Text>
            <Text style={[{ fontFamily: fonts.MULISH.bold, fontSize: fontSizes.xExtraBig, color: dark ? '#FFF' : '#111' }]}>Where are you going today?</Text>

            <Text style={[{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.semiExtraBig, marginTop: hp(5.4), color: dark ? '#FFF' : '#111' }]}>Route Planner</Text>

            <View style={{ borderRadius: 23, elevation: dark ? 0 : 4, backgroundColor: dark ? '#23424f' : '#FFF', borderWidth: 0.5, borderColor: 'rgba(170, 255, 0, 0.2)', paddingTop: 16, paddingBottom: 20, paddingHorizontal: 12, marginTop: 20 }}>
                <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.light, color: dark ? 'rgba(255,255,255,0.6)' : '#6c6c7c', marginHorizontal: 10 }]}>Starting location</Text>
                <View style={[globalStyle.rowContainerCenteredSpaced, { marginTop: 7, paddingHorizontal: 5 }]}>
                    <TextInput value={location} onChangeText={(text) => { setLocation(text) }} placeholder="Your current location" placeholderTextColor={dark ? '#FFF' : '#0A0A26'} style={[{ paddingVertical: 0, width: '90%', fontFamily: fonts.MULISH.medium, fontSize: fontSizes.extraBig, color: dark ? '#FFF' : '#0a0a26' }]} />
                    <Feather name='edit' color={dark ? '#CECECE' : colors.GREEN.secondary} />
                </View>
                <View style={{ height: 1, width: '100%', backgroundColor: dark ? 'rgba(255,255,255,0.25)' : '#CECECE', marginTop: 20, marginBottom: 11 }} />
                <Text style={[{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.light, color: dark ? 'rgba(255,255,255,0.6)' : '#6c6c7c', marginHorizontal: 10 }]}>Destination</Text>
                <View style={[globalStyle.rowContainerCenteredSpaced, { marginTop: 7, paddingHorizontal: wp(1) }]}>
                    <TextInput value={destination} onChangeText={(text) => { setDestination(text) }} placeholder="Noida, UP" placeholderTextColor={dark ? '#FFF' : '#0A0A26'} style={[{ paddingVertical: 0, width: '90%', fontFamily: fonts.MULISH.medium, fontSize: fontSizes.extraBig, color: dark ? '#FFF' : '#0A0A26' }]} />
                    <Feather name='edit' color={dark ? '#CECECE' : colors.GREEN.secondary} />
                </View>
                <View style={{ height: 1, width: '100%', backgroundColor: dark ? 'rgba(255,255,255,0.25)' : '#CECECE', marginTop: 20 }} />
                <View style={{ paddingHorizontal: '10%', paddingTop: 20 }}>
                    <Button label='Get the route' />
                </View>
            </View>

            <Text style={[{ fontFamily: fonts.MULISH.regular, fontSize: fontSizes.semiExtraBig, marginTop: hp(5.4), color: dark ? '#FFF' : '#111' }]}>Trip From Delhi</Text>
            <SafeAreaView style={{ overflow: 'hidden', borderRadius: 4 }}>
                <MapView
                    style={{ height: hp(13), marginTop: 8 }}
                    region={region}
                    customMapStyle={dark ? mapStyle : undefined}
                    onRegionChangeComplete={(region) => { setRegion(region) }}
                />
            </SafeAreaView>
        </ScrollView>
    )
}

export default RoutePlanner;