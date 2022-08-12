import {
    SET_HOME_DETAILS,
    UPDATE_USER_WALLET_BALANCE,
    SET_USER_SELECTED_CONNECTOR,
    SET_USER_CURRENT_LOCATION
} from './ActionTypes';


export const setHomeDetails = (homeDetails) => {
    return {
        type: SET_HOME_DETAILS,
        homeDetails
    };
};

export const updateUserWalletBalance = (balance) => {
    return {
        type: UPDATE_USER_WALLET_BALANCE,
        balance
    };
};

export const setUserCurrentLocation = (userLocation) => {
    return {
        type: SET_USER_CURRENT_LOCATION,
        userLocation
    };
};