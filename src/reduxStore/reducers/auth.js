import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_REQUEST,
    KEEP_USER_SIGNIN,
    FORGET_PASSWORD_KEY,
    UPDATE_FCM_TOKEN,
    IS_UPDATE_AVAILABLE,
    SAVE_USER_DATA,
    SET_USERS_VEHICLE,
    EXPIRE_LOGIN_SESSION
} from 'reduxStore/actions/ActionTypes';

import { staticUserInfo } from 'utils/Common';

const INITIAL_STATE = {
    isLoggingIn: false,
    loginError: false,
    isKeepUserSignIn: false,
    // loginInfo: staticUserInfo,
    loginInfo: null,
    userInfo: null,
    forgetPasswordEmail: null,
    forgetPasswordLink: null,
    deviceFCMToken: null,
    isUpdateAvailable: false,
    userVehicles: []
};

const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggingIn: true,
                loginError: false,
                loginInfo: action.loginInfo
            };
        case SAVE_USER_DATA:
            return {
                ...state,
                userInfo: action.userInfo
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                isLoggingIn: false,
                loginError: true
            };
        case LOGOUT_REQUEST:
            return {
                ...state,
                isLoggingIn: false,
                loginError: false
            };
        case KEEP_USER_SIGNIN:
            return {
                ...state,
                isKeepUserSignIn: !state.isKeepUserSignIn
            };
        case FORGET_PASSWORD_KEY:
            return {
                ...state,
                forgetPasswordEmail: action.payload.email,
                forgetPasswordLink: action.payload.link
            };
        case UPDATE_FCM_TOKEN:
            return {
                ...state,
                deviceFCMToken: action.fcmToken
            };
        case IS_UPDATE_AVAILABLE:
            return {
                ...state,
                isUpdateAvailable: action.isUpdateAvailable
            }
        case SET_USERS_VEHICLE:
            return {
                ...state,
                userVehicles: action.userVehicle
            }
        case EXPIRE_LOGIN_SESSION:
            return {
                ...state,
                loginInfo: { ...state.loginInfo, token: action.token }
            }
        default:
            return state;
    }
}

export default authReducer