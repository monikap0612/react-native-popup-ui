import React, { useEffect } from "react";
import { Dimensions, Text, View } from "react-native";
import { fonts } from 'styleConfig';

const { height, width } = Dimensions.get('screen');

const scale = width / 428;


const StyledText = ({ font = 'regular', size = 14, center = false, color = '#FFFFFF', ...props }) => {

    const getFamily = (family) => {
        switch (family) {
            case 'oswald':
                return fonts.OSWALD;
            case 'mulish':
                return fonts.MULISH;
            default:
                return fonts.MULISH;
        }
    }

    const getFont = (font, family) => {
        var fontFamily = getFamily(family);
        switch (font) {
            case 'black':
                return fontFamily.black;
            case 'extraBold':
                return fontFamily.extraBold;
            case 'bold':
                return fontFamily.bold;
            case 'semiBold':
                return fontFamily.semiBold;
            case 'medium':
                return fontFamily.medium;
            case 'regular':
                return fontFamily.regular;
            case 'light':
                return fontFamily.light;
            case 'extraLight':
                return fontFamily.extraLight;
            default:
                return fontFamily.regular;
        }
    }

    return (
        <Text style={[{ fontFamily: getFont(font, props.family), fontSize: size * scale, color: color, textAlign: center ? 'center' : undefined }, props.style]}>{props.children}</Text>
    )
}

export default StyledText;