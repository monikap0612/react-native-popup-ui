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
} from './ActionTypes';


export const userSuccess = (loginInfo) => {
    return {
        type: LOGIN_SUCCESS,
        loginInfo
    };
};

export const userFailure = () => {
    return {
        type: LOGIN_FAILURE
    };
};

export const userLogout = () => {
    return {
        type: LOGOUT_REQUEST
    };
};

export const keepUserSignIn = () => {
    return {
        type: KEEP_USER_SIGNIN
    };
};

export const saveForgetPasswordKey = (payload) => {
    return {
        type: FORGET_PASSWORD_KEY,
        payload
    };
};

export const setFCMToken = (fcmToken) => {
    return {
        type: UPDATE_FCM_TOKEN,
        fcmToken
    };
};

export const setIsUpdateAvailable = (isUpdateAvailable) => {
    return {
        type: IS_UPDATE_AVAILABLE,
        isUpdateAvailable
    };
};

export const saveUserData = (userInfo) => {
    return {
        type: SAVE_USER_DATA,
        userInfo
    };
};

export const saveUserVehicles = (userVehicle) => {
    return {
        type: SET_USERS_VEHICLE,
        userVehicle
    };
};

export const setExpiredUserToken = (token) => {
    return {
        type: EXPIRE_LOGIN_SESSION,
        token
    };
};