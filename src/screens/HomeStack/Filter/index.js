import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { Dimensions, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StyledText, Slider } from 'components';
import { colors, globalStyle } from 'styleConfig';
import Connector1 from '../../../assets/images/connector1.svg';
import ConnectorGreen1 from '../../../assets/images/connector1-green.svg';
import Connector2 from '../../../assets/images/connector2.svg';
import ConnectorGreen2 from '../../../assets/images/connector2-green.svg';
import Connector3 from '../../../assets/images/connector3.svg';
import ConnectorGreen3 from '../../../assets/images/connector3-green.svg';
import Connector4 from '../../../assets/images/connector4.svg';
import ConnectorGreen4 from '../../../assets/images/connector4-green.svg';
import Feather from 'react-native-vector-icons/Feather';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const amenities = [
    {
        label: 'WIFI',
        key: 0
    },
    {
        label: 'Restaurant',
        key: 1
    },
    {
        label: 'Shopping Mall',
        key: 2
    },
    {
        label: 'CCD',
        key: 3
    },
]

const { height, width } = Dimensions.get('screen');

const Filter = (props) => {
    // Gets the current theme. Dark or light
    const { dark } = useTheme();

    const [chargerTypeIndex, setChargerTypeIndex] = useState(0);
    const [connectorIndex, setConnectorIndex] = useState(0);
    const [discount, setDiscount] = useState(false);
    const [availableChargers, setAvailableChargers] = useState(false);
    const [freeChargers, setFreeChargers] = useState(false);
    const [multiSliderValue, setMultiSliderValue] = React.useState([22, 60]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    multiSliderValuesChange = values => setMultiSliderValue(values);

    const handleAmenity = (key) => {
        var _amenities = [...selectedAmenities];
        if (_amenities.includes(key)) {
            const index = _amenities.indexOf(key);
            _amenities.length == 1 ? _amenities.pop() : _amenities.splice(index, 1);
        } else {
            _amenities.push(key)
        }
        setSelectedAmenities(_amenities);
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingTop: hp(5), paddingBottom: hp(4), paddingHorizontal: wp(5) }} style={{ backgroundColor: dark ? colors.BLUEGREY.secondary : '#FFF' }}>

            <View style={[globalStyle.rowContainerCenteredSpaced, { marginBottom: hp(2) }]}>
                <StyledText font='regular' size={22} color={dark ? '#FFF' : '#0A0A26'}>Charger Type</StyledText>
                <TouchableWithoutFeedback onPress={() => { props.navigation.pop() }}>
                    <Feather name='x' size={24} color={dark ? '#FFF' : '#0A0A26'} />
                </TouchableWithoutFeedback>
            </View>

            <View style={{ flexDirection: 'row', height: hp(5), backgroundColor: dark ? '#0E2831' : '#FFF', borderRadius: 50, elevation: dark ? 0 : 4, overflow: 'hidden', elevation: dark ? 0 : 4, borderWidth: dark ? 1 : 0, borderColor: 'rgba(255,255,255,0.24)' }}>
                <TouchableWithoutFeedback onPress={() => { setChargerTypeIndex(0) }}>
                    <View style={[styles.selectItem, { backgroundColor: chargerTypeIndex == 0 ? colors.GREEN.secondary : undefined }]}>
                        <StyledText font='regular' size={18} color={dark ? '#FFF' : chargerTypeIndex == 0 ? '#FFF' : '#0A0A26'}>All</StyledText>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { setChargerTypeIndex(1) }}>
                    <View style={[styles.selectItem, { backgroundColor: chargerTypeIndex == 1 ? colors.GREEN.secondary : undefined }]}>
                        <StyledText font='regular' size={18} color={dark ? '#FFF' : chargerTypeIndex == 1 ? '#FFF' : '#0A0A26'}>AC</StyledText>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { setChargerTypeIndex(2) }}>
                    <View style={[styles.selectItem, { backgroundColor: chargerTypeIndex == 2 ? colors.GREEN.secondary : undefined }]}>
                        <StyledText font='regular' size={18} color={dark ? '#FFF' : chargerTypeIndex == 2 ? '#FFF' : '#0A0A26'}>DC</StyledText>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { setChargerTypeIndex(3) }}>
                    <View style={[styles.selectItem, { backgroundColor: chargerTypeIndex == 3 ? colors.GREEN.secondary : undefined }]}>
                        <StyledText font='regular' size={18} color={dark ? '#FFF' : chargerTypeIndex == 3 ? '#FFF' : '#0A0A26'}>16A Plug</StyledText>
                    </View>
                </TouchableWithoutFeedback>
            </View>

            {/* <View style={{ paddingTop: hp(3) }}>
                <StyledText font='regular' size={22} color={dark ? '#FFF' : '#0A0A26'}>Charging Power</StyledText>

                <MultiSlider
                    containerStyle={{ alignSelf: 'center' }}
                    values={[multiSliderValue[0], multiSliderValue[1]]}
                    sliderLength={(width - wp(12))}
                    trackStyle={{ backgroundColor: dark ? '#17677F' : '#F0F0F0', height: 10, borderRadius: 50 }}
                    selectedStyle={{ backgroundColor: colors.GREEN.secondary }}
                    markerStyle={{ backgroundColor: dark ? '#FFF' : '#0A0A26', height: 14, width: 14, marginTop: 8 }}
                    pressedMarkerStyle={{ height: 24, width: 24 }}
                    onValuesChange={multiSliderValuesChange}
                    showSteps={true}
                    min={7}
                    max={60}
                    step={1}
                    allowOverlap
                    snapped
                />
                <View style={[globalStyle.rowContainerCenteredSpaced]}>
                    <StyledText font='regular' size={16} color={dark ? '#FFF' : '#0A0A26'}>{multiSliderValue[0]} KW</StyledText>
                    <StyledText font='regular' size={16} color={dark ? '#FFF' : '#0A0A26'}>{multiSliderValue[1]} KW{multiSliderValue[1] == 60 && '>'}</StyledText>
                </View>
            </View> */}

            <StyledText style={{ marginTop: hp(3) }} font='light' size={22} color={dark ? '#FFF' : '#0A0A26'}>Charger Connector</StyledText>

            <View style={[globalStyle.rowContainerCenteredSpaced, { marginTop: hp(2) }]}>
                <TouchableWithoutFeedback onPress={() => { setConnectorIndex(0) }}>
                    <View style={[styles.connectorContainer, { backgroundColor: connectorIndex == 0 ? colors.GREEN.secondary : dark ? colors.BLUEGREY.secondary : '#FFF', borderColor: connectorIndex == 0 ? undefined : 'rgba(255,255,255,0.4)', borderWidth: dark ? connectorIndex == 0 ? 0 : 1 : 0, elevation: dark ? 0 : 4 }]}>
                        {
                            dark ?
                                <Connector1 />
                                :
                                connectorIndex == 0 ?
                                    <Connector1 />
                                    :
                                    <ConnectorGreen1 />
                        }
                        <StyledText style={{ textAlign: 'center', marginTop: hp(1) }} font='regular' size={14} color={dark ? '#FFF' : '#0A0A26'}>Type 2</StyledText>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { setConnectorIndex(1) }}>
                    <View style={[styles.connectorContainer, { backgroundColor: connectorIndex == 1 ? colors.GREEN.secondary : dark ? colors.BLUEGREY.secondary : '#FFF', borderColor: connectorIndex == 1 ? undefined : 'rgba(255,255,255,0.4)', borderWidth: dark ? connectorIndex == 1 ? 0 : 1 : 0, elevation: dark ? 0 : 4 }]}>
                        {
                            dark ?
                                <Connector2 />
                                :
                                connectorIndex == 1 ?
                                    <Connector2 />
                                    :
                                    <ConnectorGreen2 />
                        }
                        <StyledText style={{ textAlign: 'center', marginTop: hp(1) }} font='regular' size={14} color={dark ? '#FFF' : '#0A0A26'}>Type 2</StyledText>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { setConnectorIndex(2) }}>
                    <View style={[styles.connectorContainer, { backgroundColor: connectorIndex == 2 ? colors.GREEN.secondary : dark ? colors.BLUEGREY.secondary : '#FFF', borderColor: connectorIndex == 2 ? undefined : 'rgba(255,255,255,0.4)', borderWidth: dark ? connectorIndex == 2 ? 0 : 1 : 0, elevation: dark ? 0 : 4 }]}>
                        {
                            dark ?
                                <Connector3 />
                                :
                                connectorIndex == 2 ?
                                    <Connector3 />
                                    :
                                    <ConnectorGreen3 />
                        }
                        <StyledText style={{ textAlign: 'center', marginTop: hp(1) }} font='regular' size={14} color={dark ? '#FFF' : '#0A0A26'}>Type 2</StyledText>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={[globalStyle.rowContainerCenteredSpaced, { marginTop: hp(2) }]}>
                <TouchableWithoutFeedback onPress={() => { setConnectorIndex(3) }}>
                    <View style={[styles.connectorContainer, { backgroundColor: connectorIndex == 3 ? colors.GREEN.secondary : dark ? colors.BLUEGREY.secondary : '#FFF', borderColor: connectorIndex == 3 ? undefined : 'rgba(255,255,255,0.4)', borderWidth: dark ? connectorIndex == 3 ? 0 : 1 : 0, elevation: dark ? 0 : 4 }]}>
                        {
                            dark ?
                                <Connector4 />
                                :
                                connectorIndex == 3 ?
                                    <Connector4 />
                                    :
                                    <ConnectorGreen4 />
                        }
                        <StyledText style={{ textAlign: 'center', marginTop: hp(1) }} font='regular' size={14} color={dark ? '#FFF' : '#0A0A26'}>Type 2</StyledText>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { setConnectorIndex(4) }}>
                    <View style={[styles.connectorContainer, { backgroundColor: connectorIndex == 4 ? colors.GREEN.secondary : dark ? colors.BLUEGREY.secondary : '#FFF', borderColor: connectorIndex == 4 ? undefined : 'rgba(255,255,255,0.4)', borderWidth: dark ? connectorIndex == 4 ? 0 : 1 : 0, elevation: dark ? 0 : 4 }]}>
                        {
                            dark ?
                                <Connector2 />
                                :
                                connectorIndex == 4 ?
                                    <Connector2 />
                                    :
                                    <ConnectorGreen2 />
                        }
                        <StyledText style={{ textAlign: 'center', marginTop: hp(1) }} font='regular' size={14} color={dark ? '#FFF' : '#0A0A26'}>Type 2</StyledText>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { setConnectorIndex(5) }}>
                    <View style={[styles.connectorContainer, { backgroundColor: connectorIndex == 5 ? colors.GREEN.secondary : dark ? colors.BLUEGREY.secondary : '#FFF', borderColor: connectorIndex == 5 ? undefined : 'rgba(255,255,255,0.4)', borderWidth: dark ? connectorIndex == 5 ? 0 : 1 : 0, elevation: dark ? 0 : 4 }]}>
                        {
                            dark ?
                                <Connector3 />
                                :
                                connectorIndex == 5 ?
                                    <Connector3 />
                                    :
                                    <ConnectorGreen3 />
                        }
                        <StyledText style={{ textAlign: 'center', marginTop: hp(1) }} font='regular' size={14} color={dark ? '#FFF' : '#0A0A26'}>Type 2</StyledText>
                    </View>
                </TouchableWithoutFeedback>
            </View>


            <View style={[globalStyle.rowContainerCenteredSpaced, { paddingVertical: hp(1.5) }]}>
                <StyledText font='light' size={22} color={dark ? '#FFF' : '#0A0A26'}>Discount Available</StyledText>
                <Slider value={discount} onChangeValue={(val) => { setDiscount(val) }} />
            </View>
            <View style={[globalStyle.rowContainerCenteredSpaced, { paddingVertical: hp(1.5) }]}>
                <StyledText font='light' size={22} color={dark ? '#FFF' : '#0A0A26'}>Only Available Chargers</StyledText>
                <Slider value={availableChargers} onChangeValue={(val) => { setAvailableChargers(val) }} />
            </View>
            <View style={[globalStyle.rowContainerCenteredSpaced, { paddingVertical: hp(1.5) }]}>
                <StyledText font='light' size={22} color={dark ? '#FFF' : '#0A0A26'}>Only Free Chargers</StyledText>
                <Slider value={freeChargers} onChangeValue={(val) => { setFreeChargers(val) }} />
            </View>

            <StyledText font='light' size={22} color={dark ? '#FFF' : '#0A0A26'}>Amenities</StyledText>
            <View style={[globalStyle.rowContainerCenteredSpaced, { paddingVertical: hp(1.5) }]}>
                {
                    amenities.map(element => {
                        return (
                            <TouchableWithoutFeedback onPress={() => { handleAmenity(element.key) }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: dark ? 1 : 0, borderColor: 'rgba(255,255,255,0.24)', minWidth: wp(18.7), height: hp(3.3), borderRadius: 50, backgroundColor: selectedAmenities.includes(element.key) ? colors.GREEN.secondary : dark ? '#0E2831' : '#DADADA', paddingHorizontal: wp(2) }}>
                                    <StyledText font='light' size={12} color={'#FFF'}>{element.label}</StyledText>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })
                }
            </View>
            <View style={[globalStyle.rowContainerCenteredSpaced, { paddingVertical: hp(1.5) }]}>
                <TouchableWithoutFeedback onPress={() => { }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: dark ? 1 : 0, borderColor: 'rgba(255,255,255,0.24)', width: '40%', height: hp(5), borderRadius: 50, backgroundColor: dark ? '#0E2831' : '#6AE66E', paddingHorizontal: wp(2) }}>
                        <StyledText font='light' size={18} color={'#FFF'}>Reset</StyledText>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '40%', height: hp(5), borderRadius: 50, backgroundColor: colors.GREEN.secondary, paddingHorizontal: wp(2) }}>
                        <StyledText font='light' size={18} color={'#FFF'}>Apply</StyledText>
                    </View>
                </TouchableWithoutFeedback>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    selectItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    connectorContainer: {
        height: wp(25),
        width: wp(25),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        borderWidth: 1,
    },
    circle: {
        height: 14,
        width: 14,
        borderRadius: 50,
    }
})

export default Filter;