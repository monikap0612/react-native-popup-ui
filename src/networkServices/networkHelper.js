import { isEmpty, get } from 'lodash';
import NetInfo from "@react-native-community/netinfo";
import { Alert } from 'react-native';
import { showAlert, hideAlert } from 'react-native-easy-alert';
import { colors } from 'styleConfig';
import { Popup } from 'popup-ui';

export const isGetSuccessData = (payLoad) => {
    if (!isEmpty(payLoad)) {
        if (get(payLoad, 'statusCode', 400) === 200) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

export const apiFallBackAlert = (payLoad, dark) => {
    // const title = "Status code : " + get(payLoad, 'statusCode', 'Alert').toString();;
    // const description = get(payLoad, 'message', 'Something went wrong');
    // Alert.alert(
    //     title,
    //     description,
    //     [
    //         { text: "OK", onPress: () => console.log(description) }
    //     ]
    // );
    const title = get(payLoad, 'statusCode', null) ? "Status code : " + get(payLoad, 'statusCode', 'Alert').toString() : 'Alert';
    const description = get(payLoad, 'message', 'Something went wrong');
    Popup.show({
        type: 'Danger',
        title: title,
        button: true,
        textBody: description,
        buttonText: 'Ok',
        // popUpBG: dark ? colors.BLUEGREY.secondary : '#3D413D',
        popUpBG: dark ? colors.BLUEGREY.secondary : '#E7E1E0',
        titleStyle: dark ? { color: '#C4AE78' } : {},
        descStyle: dark ? { color: '#F9F6F0' } : {},
        callback: () => Popup.hide()
    })
}

export const checkInternet = () => {
    return new Promise((resolve, reject) => {
        NetInfo.fetch().then(state => {
            const isConnected = get(state, 'isConnected', false);
            resolve(isConnected)
        })
    })
}

export const showInternetLostAlert = (okPress) => {
    showAlert({
        titleParam: 'No Internet connection !!!',
        bodyParam: 'Please check internet connection, try again later',
        buttonsParam: [
            {
                backgroundColor: colors.GREEN.secondary,
                text: 'Retry',
                onPressAction: () => okPress(),
            },
            {
                backgroundColor: 'transparent',
                text: 'OK',
                onPressAction: () => hideAlert(),
            }
        ],
    })
}
