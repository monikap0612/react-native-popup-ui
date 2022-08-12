import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { StickyHeader } from 'components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import UserService from "networkServices/UserService";
import { showHUD, hideHUD } from 'utils/loader';
import { useSelector, useDispatch } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';

import { get, map } from "lodash";
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';

import { saveUserData } from 'reduxStore/actions/auth';
import { setNotificationData } from "reduxStore/actions/notification";
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';

const Notification = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const dispatch = useDispatch();
    const { loginInfo, userInfo, deviceFCMToken } = useSelector((state) => state.auth);
    const { notificationConfig, notificationList } = useSelector((state) => state.notification);

    // const [notificationList, setNotificationList] = useState([])

    useEffect(() => {
    }, [])

    async function updateNotificationData(notificationId) {
        let mapNotificationListData = map(notificationList, (el) => {
            return {
                ...el, isExpanded: get(el, '_id', null) == notificationId ? true : get(el, 'StatusRead', false)
            }
        })

        let notificationData = {
            ...notificationConfig,
            NotificationList: mapNotificationListData
        }
        dispatch(setNotificationData(notificationData))
    }

    async function onToggleList(element) {

        const Obj = [
            { name: "NotificationID", data: get(element, '_id', '') },
        ];

        // console.log("---obj---", Obj)
        let isConnected = await checkInternet();
        if (isConnected) {
            showHUD()
            const updateStatus = await UserService.updateNotificationStatus(loginInfo, Obj);
            hideHUD();
            // console.log("---updateStatus--", updateStatus);
            if (isGetSuccessData(updateStatus)) {
                updateNotificationData(get(element, '_id', ''));
            } else {
                apiFallBackAlert(updateStatus, dark)
            }
        }
        else {
            showInternetLostAlert(() => {
                onToggleList()
            });
        }
    }

    return (
        <View showsVerticalScrollIndicator={false} style={{ flexGrow: 1, paddingBottom: hp(12), backgroundColor: dark ? '#0E2831' : '#FFF' }}>
            <StickyHeader {...props} headerTitle="Notification" />
            

            <View style={{ paddingHorizontal: wp(5), paddingTop: hp(3) }}>
                {
                    notificationList.map(element => {
                        return (
                            <View>
                                <Collapse
                                    style={{ borderWidth: 1, borderRadius: 6, borderColor: dark ? 'rgba(255,255,255,0.45)' : colors.GREEN.secondary, overflow: 'hidden', backgroundColor: colors.GREEN.secondary, marginBottom: hp(3.2) }}
                                    isExpanded={get(element, 'isExpanded', false) == true ? true : false}
                                    disabled={get(element, 'isExpanded', false)}
                                    onToggle={() => onToggleList(element)}
                                >
                                    <CollapseHeader>
                                        <View style={styles.header}>
                                            <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.extraBig }}>{get(element, 'Title', '')}</Text>
                                            <Entypo name={'dot-single'} size={36} style={{ color: get(element, 'StatusRead', false) == true ? 'transparent' : 'red' }} />
                                            {/* <Text style={{ color: dark ? '#fff' : '#000' }}>{get(element, 'StatusRead', false) == true ? 'Read' : 'Unread'}</Text> */}
                                        </View>
                                    </CollapseHeader>
                                    <CollapseBody>
                                        <View style={[styles.body, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF' }]}>
                                            <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.regular, lineHeight: 26, color: dark ? '#fff' : '#000' }}>{get(element, 'Message', '')}</Text>
                                        </View>
                                    </CollapseBody>
                                </Collapse>
                            </View>
                        )
                    })
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16
    },
    body: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 16,
    }
})


export default Notification;