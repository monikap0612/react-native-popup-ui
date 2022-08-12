import { StyleSheet } from "react-native";
import colors from "./colors";
import fonts from "./fonts";
import fontSizes from './fontSizes';

const fontStyle = StyleSheet.create({

    // Font weights

    black: {
        fontFamily: fonts.black
    },
    bold: {
        fontFamily: fonts.bold
    },
    semiBold: {
        fontFamily: fonts.semiBold
    },
    medium: {
        fontFamily: fonts.medium
    },
    regular: {
        fontFamily: fonts.regular
    },

    blackDisplay: {
        fontFamily: fonts.blackDisplay
    },
    boldDisplay: {
        fontFamily: fonts.boldDisplay
    },
    semiBoldDisplay: {
        fontFamily: fonts.semiBoldDisplay
    },
    mediumDisplay: {
        fontFamily: fonts.mediumDisplay
    },
    regularDisplay: {
        fontFamily: fonts.regularDisplay
    },

    // Font colors

    white: {
        color: '#FFFFFF'
    },

    // Font sizes
    titleS: {
        fontSize: fontSizes.title
    },
    headerS: {
        fontSize: fontSizes.header
    },
    extraBigS: {
        fontSize: fontSizes.extraBig
    },
    semiExtraBigS: {
        fontSize: fontSizes.semiExtraBig
    },
    bigS: {
        fontSize: fontSizes.big
    },
    regularS: {
        fontSize: fontSizes.regular
    },
    lightS: {
        fontSize: fontSizes.light
    },
    ultraLightS: {
        fontSize: fontSizes.ultraLight
    },

    // Formats

    centered: {
        textAlign: 'center'
    },
    left: {
        textAlign: 'left'
    },
    right: {
        textAlign: 'right'
    },
    shadow: {
        textShadowColor: 'rgba(0,0,0,0.44)',
        textShadowRadius: 10,
        textShadowOffset: { width: 0, height: 1 }
    }

});

export default fontStyle;