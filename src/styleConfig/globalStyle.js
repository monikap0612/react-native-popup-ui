import { StyleSheet } from "react-native";

const globalStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    scrollContentContainer: {
        flexGrow: 1
    },
    scrollContainer: {
        backgroundColor: '#FFFFFF'
    },
    rowContainer: {
        flexDirection: 'row',
    },
    rowContainerSpaced: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowContainerCentered: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowContainerCenteredSpaced: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    centeredContent: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    absoluteContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }
})

export default globalStyle;