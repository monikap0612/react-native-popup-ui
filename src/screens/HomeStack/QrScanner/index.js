import React, { Component } from 'react';
import { useTheme } from "@react-navigation/native";
import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking,
    View,
    TouchableWithoutFeedback
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import { ChargeType, Button, StyledText } from 'components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ScanScreen = (props) => {

    const { dark } = useTheme();


    const onSuccess = e => {
        // console.log("----on success-----", e.data)
        Linking.openURL(e.data).catch(err =>
            console.error('An error occured', err)
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={[globalStyle.centeredContent, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', paddingVertical: 16 }]}>
                <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.header, color: dark ? '#fff' : '#000' }}>QR Scanner</Text>
                <TouchableWithoutFeedback onPress={() => { props.navigation.pop() }}>
                    <Feather style={{ position: 'absolute', left: 18, color: dark ? '#fff' : '#000' }} name='chevron-left' size={24} />
                </TouchableWithoutFeedback>
            </View>
            <QRCodeScanner
                onRead={(e) => onSuccess(e)}
                flashMode={RNCamera.Constants.FlashMode.auto}
                showMarker={true}
                reactivate={true}
                markerStyle={{ borderRadius: 50 / 2, height: hp(35), width: wp(70) }}
                cameraContainerStyle={{ height: '100%', width: '100%', alignSelf: 'center', }}
                cameraStyle={{ height: '100%', width: '100%', alignSelf: 'center' }}
            />
            <View style={{ height: hp(25), backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4' }}>
                <View style={{marginTop: hp(6)}}>
                    <StyledText font='medium' size={18} color={dark ? '#fff' : '#0A0A26'} center={true}>VoltPanda</StyledText>
                    <StyledText font='medium' size={16} color={dark ? '#fff' : '#0A0A26'} center={true}>Scan the QR Code for go to the App</StyledText>
                </View>
            </View>
            <View style={{ paddingHorizontal: wp(5), position: 'absolute', bottom: 20, width: '100%' }}>
                <Button label='Go Back' onPress={() => { props.navigation.pop() }} />
            </View>
        </View>
        // </View>
    );
}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    }
});
export default ScanScreen;
