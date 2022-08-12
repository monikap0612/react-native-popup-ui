import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, fonts, fontSizes, globalStyle } from 'styleConfig';

const styles = StyleSheet.create({
    modalOuterContainer: {
        width: '90%',
        backgroundColor: "#fff",
        borderRadius: 18,
        alignSelf: 'center',
        overflow: 'hidden'
    },
    modalContainer: {
        padding: 25,
        paddingBottom: 10
    },
    modalTitle: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize:  21,
        fontWeight: '500',
        marginVertical: 10,
    },
    modalSubTitle: {
        textAlign: 'left',
        alignSelf: 'center',
        fontSize: 17,
        fontWeight: '200',
    },
    wifiImage: {
        height: wp('40%'),
        width: wp('40%'),
        alignSelf: 'center',
        marginVertical: 25
    },
    buttonStyle: {
        height:  45,
        width: '100%',
        borderRadius: 10,
        backgroundColor: colors.GREEN.secondary,
        marginVertical:  10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize:  16,
        fontWeight: '600',
        color: "#fff",
        textAlign: 'center',
        alignSelf: 'center',
    },
    buttonIcon: {
        textAlign: 'center',
        alignSelf: 'center'
    }
})

export default styles;
