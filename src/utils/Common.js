import { Dimensions, Platform, PixelRatio, Linking, Share } from 'react-native';
import { Popup } from 'popup-ui';
import { colors } from 'styleConfig';
import moment from 'moment';
import { showLocation } from 'react-native-map-link';
import { get } from 'lodash';

const { width: winWidth, height: winHeight } = Dimensions.get('window');
export const OTP_CELL_COUNT = 6;
export const bypassValue = 405605;
export const chargingSyncBufferTime = 10000;

export const isIOS = Platform.OS === 'ios';

export const backgroundRecallThreshold = 0.5;

export const androidPackageName = 'com.voltpanda';
export const iosPackageName = 'org.reactjs.native.example.voltpanda';
export const dynamicLinkPrefix = 'https://voltpanda.page.link';
export const voltPandaLocationShareMessage = "Voltpanda charging location: "


export const staticUserInfo = {
    "_id": "62de2a4533e1c0f5f1552cd1",
    "userid": "62d7847ecc6c6e4e01f88b57",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZDc4NDdlY2M2YzZlNGUwMWY4OGI1NyIsImlhdCI6MTY1ODcyNjk4MSwiZXhwIjoxNjYzMDQ2OTgxfQ.nV9Ua8HBqzqPwPMLOPWC78gwJa0Nw99SMrraQwYzsAw",
    "firebaseToken": "ehyHI3ZOU0zqoBSXUKf6GX:APA91bEN-pz1ih0pIy4Q2HuaG4fvmhBA3HQ_vsVkQubMTfKzF_V7E7TJAnn4DNS8DVsHMkbVCMvZX1ogDCI-irEXLOXZpmGyQzKw1CqbK_1loX7iQW4mgPbOGyD5aaZosbKgBnuBPArW"
}

export const staticUser = {
    "_id": "62d7847ecc6c6e4e01f88b57",
    "PhoneNumber": "8849585644",
    "Country": "India",
    "MainWallet": "120",
    "TmpWallet": "0",
    "TransitionWallet": {
        "$numberDecimal": "0"
    },
    "Status": false,
    "AddedDate": "2022-07-20T04:28:46.260Z",
    "ModifyDate": "2022-07-20T04:28:46.260Z",
    "__v": 0,
    "Email": "thomasshalby34@yopmail.com",
    "GST": "98563214789654",
    "Name": "Thomas Shalby"
}
// export const razorPayKey = 'rzp_test_JTYvqAIBHEJoYj'; // local
export const razorPayKey = 'rzp_test_O7UrTnCH3hP1OL';

export const quickTopUpOption = [
    { id: 0, isSelect: false, amount: 100 },
    { id: 1, isSelect: true, amount: 500 },
    { id: 2, isSelect: false, amount: 1000 },
    { id: 3, isSelect: false, amount: 1500 },
]

const scale = winWidth / 320;

export function normalize(size) {
    const newSize = size * scale
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    }
}

export const redirectToMap = (redirectionPayload) => {
    const { startAddress, endAddress, label } = redirectionPayload;
    showLocation({
        latitude: get(startAddress, 'latitude', null),
        longitude: get(startAddress, 'longitude', null),
        sourceLatitude: get(endAddress, 'latitude', null), // optionally specify starting location for directions
        sourceLongitude: get(endAddress, 'longitude', null), // not optional if sourceLatitude is specified
    });
}

export const shareLocationInvite = async (shareLocationPayload) => {
    try {
        const { locationLink, locationName, address, contactNumber } = shareLocationPayload;

        const result = await Share.share({
            title: 'voltPanda Location',
            message: voltPandaLocationShareMessage + locationLink,
            message: `Voltpanda charging location:\nlocationName: ${locationName}\nlocationAddress: ${address}\ncontactNumber: ${contactNumber}\nchargingStation: ${locationLink}`,
            url: locationLink
        });
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
            } else {
                // shared
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
    } catch (error) {
        errorPopUp(dark, error.message);
    }
}

export function msToHMS(ms) {
    // 1- Convert to seconds:
    let seconds = ms / 1000;
    // 2- Extract hours:
    const hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    const minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = parseInt(seconds % 60);

    return `${hours}:${minutes}:${seconds}`
}

export function ssToHMS(SECONDS) {
    return moment.utc(SECONDS * 1000).format('HH:mm:ss')
}

export function milSecondToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export function warningPopUp(textBody, dark) {
    Popup.show({
        type: 'Warning',
        title: "Alert",
        textBody: textBody,
        buttonText: 'Ok',
        popUpBG: dark ? colors.BLUEGREY.secondary : '#E7E1E0',
        titleStyle: dark ? { color: '#C4AE78' } : {},
        descStyle: dark ? { color: '#F9F6F0' } : {},
        callback: () => Popup.hide(),
    })
}

export function errorPopUp(dark, textBody, title = "Alert") {
    Popup.show({
        type: 'Danger',
        title: title,
        textBody: textBody,
        buttonText: 'Ok',
        popUpBG: dark ? colors.BLUEGREY.secondary : '#E7E1E0',
        titleStyle: dark ? { color: '#C4AE78' } : {},
        descStyle: dark ? { color: '#F9F6F0' } : {},
        callback: () => Popup.hide(),
    })
}

export function minToHH(minute) {
    // const hours = parseInt(minute / 60);
    const hours = moment.utc().startOf('day').add(minute, 'minutes').format('hh A')

    return hours;
}