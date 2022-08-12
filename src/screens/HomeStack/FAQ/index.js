import React, { useState, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import UserService from "networkServices/UserService";
import { showHUD, hideHUD } from 'utils/loader';
import { useSelector, useDispatch } from 'react-redux';
import { checkInternet, showInternetLostAlert, isGetSuccessData, apiFallBackAlert } from 'networkServices/networkHelper';
import { get} from "lodash";

const FAQ = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();
    const { loginInfo } = useSelector((state) => state.auth);

    const [questions, setQuestions] = useState([
        {
            label: 'Question goes here',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam mattis laoreet ex dictum pulvinar. Sed rutrum eu ante et gravida. Phasellus a nulla ante. Nulla maximus quis est vitae ultrices.',
            expanded: true,
            key: 0
        },
        {
            label: 'Question goes here',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam mattis laoreet ex dictum pulvinar. Sed rutrum eu ante et gravida. Phasellus a nulla ante. Nulla maximus quis est vitae ultrices.',
            expanded: false,
            key: 1
        },
        {
            label: 'Question goes here',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam mattis laoreet ex dictum pulvinar. Sed rutrum eu ante et gravida. Phasellus a nulla ante. Nulla maximus quis est vitae ultrices.',
            expanded: false,
            key: 2
        },
        {
            label: 'Question goes here',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam mattis laoreet ex dictum pulvinar. Sed rutrum eu ante et gravida. Phasellus a nulla ante. Nulla maximus quis est vitae ultrices.',
            expanded: false,
            key: 3
        },
        {
            label: 'Question goes here',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam mattis laoreet ex dictum pulvinar. Sed rutrum eu ante et gravida. Phasellus a nulla ante. Nulla maximus quis est vitae ultrices.',
            expanded: false,
            key: 4
        },
    ]);

    const [expandedIndex, setExpandedIndex] = useState(0);
    const [FAQListData, setFAQListData] = useState([])

    const toggleList = (key, isExpanded) => {
        if (expandedIndex === key) {
            setExpandedIndex(-1);
        } else {
            setExpandedIndex(key);
        }
        // var _questions = questions;
        // _questions[key].expanded = isExpanded;
        // var newArray = [..._questions];
        // setQuestions(newArray);
    }

    async function getFAQList() {
        const isConnected = await checkInternet();
        if (isConnected) {
            showHUD();
            const FAQData = await UserService.getFAQListData(loginInfo);
            hideHUD();

            const mapFAQData = get(FAQData, 'data', '').map((item, index) => {
                return{...item, key:index}
            })
            if (isGetSuccessData(FAQData)) {
                setFAQListData(mapFAQData)
            }
        } else {
            showInternetLostAlert(() => {
                getFAQList();
            });
        }
    }

    useEffect(() => {
        getFAQList();
    }, [])

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(12) }} style={{ backgroundColor: dark ? '#0E2831' : '#FFF' }}>
            <View style={[globalStyle.centeredContent, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', paddingVertical: 16 }]}>
                <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.header,color: dark ? '#fff' : '#000'}}>FAQ</Text>
                <TouchableWithoutFeedback onPress={() => { props.navigation.pop() }}>
                    <Feather style={{ position: 'absolute', left: 18, color: dark ? '#fff' : '#000' }} name='chevron-left' size={24} />
                </TouchableWithoutFeedback>
            </View>
            <View style={{ paddingHorizontal: wp(5), paddingTop: hp(3) }}>
                {
                    FAQListData.map(element => {
                        return (
                            <View>
                                <Collapse
                                    style={{ borderWidth: element.key === expandedIndex ? 1 : 0, borderRadius: 6, borderColor: dark ? 'rgba(255,255,255,0.45)' : colors.GREEN.secondary, overflow: 'hidden', backgroundColor: element.key === expandedIndex ? (dark ? colors.BLUEGREY.other : colors.GREEN.secondary) : (dark ? colors.BLUEGREY.secondary : colors.GREEN.secondary), marginBottom: element.key === expandedIndex ? hp(5.4) : hp(3.2) }}
                                    isExpanded={element.key === expandedIndex}
                                    onToggle={(isExpanded) => toggleList(element.key, isExpanded)}
                                >
                                    <CollapseHeader>
                                        <View style={styles.header}>
                                            <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.extraBig }}>{get(element, 'Questions', '')}</Text>
                                            <Feather name={element.key === expandedIndex ? 'minus' : 'plus'} size={16} />
                                        </View>
                                    </CollapseHeader>
                                    <CollapseBody>
                                        <View style={[styles.body, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF' }]}>
                                            <Text style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.regular, lineHeight: 26, color: dark ? '#fff' : '#000' }}>{get(element, 'Answers', '')}</Text>
                                        </View>
                                    </CollapseBody>
                                </Collapse>
                            </View>
                        )
                    })
                }
            </View>
        </ScrollView>
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

export default FAQ;