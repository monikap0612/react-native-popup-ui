import React from 'react';
import { useTheme } from "@react-navigation/native";
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const RootContainer = (props) => {
    const { dark } = useTheme();
    // const { isDarkTheme } = useSelector((state) => state.theme);


    const { children } = props;
    return (
        <View style={[styles.rootContainer, { backgroundColor: dark ? '#0E2831' : '#FFF' }]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        width: '100%',
        paddingBottom: hp(7) + 40,
    },
    safeAreaContainer: {
        flex: 1,
        width: '100%'
    }
})

export default RootContainer;
