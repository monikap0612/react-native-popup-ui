import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import StyledText from "../StyledText";
import Connector from '../../assets/images/connector3.svg';
import ConnectorGreen from '../../assets/images/connector3-green.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { get } from 'lodash';

import Connector1 from 'assets/images/connector1.svg';
import Connector2 from 'assets/images/connector2.svg';
import Connector3 from 'assets/images/connector3.svg';
import Connector4 from 'assets/images/connector4.svg';

import LightConnector1 from 'assets/images/connector1-green.svg';
import LightConnector2 from 'assets/images/connector2-green.svg';
import LightConnector3 from 'assets/images/connector3-green.svg';
import LightConnector4 from 'assets/images/connector4-green.svg';

const ChargeType = ({ title = 'Charger A', ...props }) => {
    const connectorType = get(props, 'MachineConnectorNo', 1);

    function connectorImageByType(type) {
        if (props.dark) {
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

    return (
        <TouchableOpacity style={[{ borderRadius: 6, overflow: 'hidden', borderWidth: props.dark ? 0 : 1, borderColor: colors.GREEN.secondary, marginRight: wp(3) }, props.style]}
            onPress={props.onPress} disabled={props.available ? false : true}>
            <View style={{ flex: 0.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: props.dark ? '#091F27' : '#F9FDFE', paddingVertical: hp(0.5), paddingHorizontal: wp(3) }}>
                <StyledText font="light" size={12} color={props.dark ? '#FFF' : '#0A0A26'}>{title}</StyledText>
                <View style={[styles.circle, { backgroundColor: colors.GREEN.secondary }]}>
                    <StyledText font="bold" size={12} color={'#FFF'}>{props.index}</StyledText>
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: hp(1.5), backgroundColor: props.dark ? '#0E2831' : '#FFF', paddingHorizontal: wp(3) }}>
                <View>
                    {/* {
                        props.dark ?
                            <Connector />
                            :
                            <ConnectorGreen />
                    } */}
                    {connectorImageByType(connectorType)}
                </View>
                <View style={{ paddingLeft: wp(4) }}>
                    <StyledText font="semiBold" size={12} color={colors.GREEN.secondary} >{props.label}</StyledText>
                    <StyledText style={{ marginTop: hp(0.5) }} center font="light" size={12} color={props.dark ? '#FFF' : '#0A0A26'} >{props.cost}</StyledText>
                </View>
            </View>
            <View style={{ flex: 0.3, backgroundColor: props.dark ? props.available ? colors.GREEN.secondary : '#091F27' : props.available ? colors.GREEN.secondary : '#F9FDFE', paddingVertical: hp(0.5), paddingLeft: wp(3) }}>
                <StyledText center font="light" size={12} color={props.dark ? '#FFF' : props.available ? '#FFF' : '#0A0A26'}>{props.available ? 'Available' : 'Unavailable'}</StyledText>
            </View>

            <View style={[globalStyle.absoluteContainer, { backgroundColor: 'rgba(0,0,0,0.5)', opacity: props.available ? 0 : 1, justifyContent: "center" }]}>
                {/* <Ionicons name='checkmark-circle-outline' size={34} color={colors.GREEN.secondary} style={{alignSelf: "center"}}/> */}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    circle: {
        height: hp(2),
        width: hp(2),
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ChargeType;