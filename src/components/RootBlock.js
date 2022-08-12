import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

const RootBlock = (props) => {

        const { children } = props;
        return (
            <View style={styles.rootContainer}>
                <SafeAreaView style={styles.safeAreaContainer}>
                    {children}
                </SafeAreaView>
            </View>
        )
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        width: '100%'
    },
    safeAreaContainer: {
        flex: 1,
        width: '100%'
    }
})
export default RootBlock;
