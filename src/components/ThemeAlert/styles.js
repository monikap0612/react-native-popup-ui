import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { normalize } from 'utils/Common';

const darkBg = '#112D38'
const lightBg = '#FFFFFF'

const styles = (isDarkTheme) => StyleSheet.create({
    modalOuterContainer: {
        width: wp('78%'),
        backgroundColor: isDarkTheme ? darkBg : lightBg,
        borderRadius: 18,
        alignSelf: 'center',
        overflow: 'hidden'
    },
    modalContainer: {
        padding: 25,
        paddingBottom: 10
    },
    wifiImage: {
        height: 80,
        width: 80,
        alignSelf: 'center',
        marginVertical: 25
    },
    modalTitle: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 21,
        // fontFamily: Theme.fontFamilies.SemiBold,
        // fontWeight: '500',
        marginVertical: 10
    },
    modalSubTitle: {
        textAlign: 'left',
        alignSelf: 'center',
        fontSize: normalize(13),
        // fontFamily: Theme.fontFamilies.Regular,
        // fontWeight: '100',
    },
    bodyImage: {
        height: wp('40%'),
        width: wp('40%'),
        alignSelf: 'center',
        marginVertical: 25
    },
    buttonStyle: {
        height: 45,
        width: '100%',
        borderRadius: 10,
        // backgroundColor: Theme.colors.saffron,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        // color: Theme.colors.white,
        textAlign: 'center',
        alignSelf: 'center',
    },
    buttonIcon: {
        textAlign: 'center',
        alignSelf: 'center'
    },

})

export default styles;
