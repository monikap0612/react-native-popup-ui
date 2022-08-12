import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, FlatList, SafeAreaView, Text, TouchableWithoutFeedback, View } from "react-native";
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { StyledText } from 'components';
import { get } from "lodash";

const ReportIssue = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const [issues, setIssues] = useState([
        {
            label: 'Status not correct',
            key: 0,
        },
        {
            label: 'Connector type/power details are not correct',
            key: 1,
        },
        {
            label: 'Issue with pricing',
            key: 2,
        },
        {
            label: 'Charger card is not accepted',
            key: 3,
        },
        {
            label: 'Charger point is not accessible',
            key: 4,
        },
        {
            label: `Couldn't find charger point`,
            key: 5,
        },
        {
            label: 'Non-electric vehicle parked in charger point location',
            key: 6,
        },
        {
            label: 'Car is parked and not charging',
            key: 7,
        },
        {
            label: 'Unable to start the charging session with tha app',
            key: 8,
        },
        {
            label: 'Other',
            key: 9,
        },
    ])

    const [isFromBooking, setIsFromBooking] = useState(false)

    function onReportIssue(item) {
        // const {isFromBooking, locationId} = props?.route?.params;
        const isFromBooking = props?.route?.params?.isFromBooking
        const locationId = props?.route?.params?.locationId
        props.navigation.navigate('ReportSuccess', {
            subject: isFromBooking ? `Issue: ${locationId}` : 'Issue',
            message: get(item, 'label', '')
        })
    }

    return (
        <View showsVerticalScrollIndicator={false} style={{ flexGrow: 1, paddingBottom: hp(12), backgroundColor: dark ? '#0E2831' : '#FFF' }}>
            <View style={[globalStyle.centeredContent, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', paddingVertical: 16 }]}>
                <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.header, color: dark ? '#FFF' : '#0A0A26' }}>Report an issue</Text>
                <TouchableWithoutFeedback onPress={() => { props.navigation.pop() }}>
                    <Feather style={{ position: 'absolute', left: 18 }} name='chevron-left' size={24} color={dark ? '#FFF' : '#0A0A26'} />
                </TouchableWithoutFeedback>
            </View>

            <View style={{ paddingHorizontal: wp(15), marginTop: hp(3) }}>
                <StyledText size={20} font='bold' style={{ textAlign: 'center' }} color={dark ? '#FFF' : '#0A0A26'}>What is the problem with charger point?</StyledText>
            </View>

            <SafeAreaView style={{ paddingTop: 25, paddingHorizontal: wp(5) }}>
                <FlatList
                    data={issues}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <TouchableWithoutFeedback onPress={() => onReportIssue(item)}>
                                <View style={[globalStyle.rowContainerCenteredSpaced, { paddingVertical: 16, borderColor: 'rgba(255,255,255,0.2)', borderBottomWidth: 1, paddingHorizontal: wp(2) }]}>
                                    <StyledText font='light' size={14} color={dark ? '#FFF' : '#0A0A26'}>{item.label}</StyledText>
                                    <Feather name='chevron-right' size={24} color={dark ? '#FFF' : '#0A0A26'} />
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    }}
                />
            </SafeAreaView>

        </View >
    )
}

export default ReportIssue;