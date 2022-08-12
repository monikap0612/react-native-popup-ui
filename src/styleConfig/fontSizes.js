import { Dimensions } from "react-native";

const WIDTH = Dimensions.get('screen').width;
const scale = WIDTH / 428;

const fontSizes = {
    xTitle: 64 * scale,
    title: 32 * scale,
    xBigHeader: 28 * scale,
    header: 24 * scale,
    xExtraBig: 22 * scale,
    extraBig: 20 * scale,
    semiExtraBig: 18 * scale,
    xBig: 17 * scale,
    big: 16 * scale,
    xRegular: 15 * scale,
    regular: 14 * scale,
    xLight: 13 * scale,
    light: 12 * scale,
    ultraLight: 10 * scale,
}

export default fontSizes;