import { useTheme } from "@react-navigation/native";
import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { StyledText } from 'components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, globalStyle, fonts, fontSizes } from 'styleConfig';
import Feather from 'react-native-vector-icons/Feather';

const StickyHeader = (props) => {

    const { dark } = useTheme();

    const { headerTitle, onBackButtonPress } = props;

    const onBackButton = (props) => {
        const { navigation } = props;
        navigation.goBack();
    }

    return (
        <View style={[globalStyle.centeredContent, { backgroundColor: dark ? colors.BLUEGREY.secondary : '#F4F4F4', paddingVertical: 16 }]}>
            <TouchableOpacity style={{
                height: 40,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                left: 18,
                position: 'absolute',
            }} onPress={() => { onBackButtonPress ? onBackButtonPress() : onBackButton(props) }}>
                <Feather name='chevron-left' size={24} color={dark ? '#FFF' : '#0A0A26'} />
            </TouchableOpacity>
            <StyledText font="light" size={24} color={dark ? '#FFF' : '#0A0A26'} style={{ fontFamily: fonts.MULISH.light, fontSize: fontSizes.header }}>{headerTitle}</StyledText>
        </View>
    )
}
export default StickyHeader;
