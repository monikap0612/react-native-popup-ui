import { StyleSheet, Platform } from 'react-native';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';

const styles = StyleSheet.create({
    modalOuterContainer: {
        width: '85%',
        backgroundColor: "#fff",
        borderRadius: 18,
        alignSelf: 'center',
        overflow: 'hidden'
    },
    modalContainer: {
        padding: 25,
    },
    modalTitle: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: '500',
        marginVertical: 10
    },
    modalSubTitle: {
        textAlign: 'left',
        alignSelf: 'center',
        fontSize:  14,
    },
    wifiImage: {
        height: 80,
        width: 80,
        alignSelf: 'center',
        marginVertical: 25
    },
    buttonStyle: {
        borderRadius: 5,
        backgroundColor: colors.GREEN.secondary
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 5,
        textAlign: 'center',
        alignSelf: 'center',
    },
    buttonIcon: {
        textAlign: 'center',
        alignSelf: 'center'
    }
})

export default styles;
