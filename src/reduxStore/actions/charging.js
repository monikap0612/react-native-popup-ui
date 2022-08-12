import {
    RESET_CHARGING_REDUX,
    SET_USER_SELECTED_CONNECTOR,
    SET_VERIFY_CHARGING_DATA,
    SET_CHARGING_ON_START,
    MARK_AS_CHARGING_COMPLETE
} from './ActionTypes';

export const resetChargingRedux = () => {
    return {
        type: RESET_CHARGING_REDUX
    };
};

export const setUserSelectedConnector = (connectorInfo) => {
    return {
        type: SET_USER_SELECTED_CONNECTOR,
        connectorInfo
    };
};

export const setVerifiedCharging = (verifiedCharging) => {
    return {
        type: SET_VERIFY_CHARGING_DATA,
        verifiedCharging
    };
};

export const setChargingOnStart = (chargingStart) => {
    return {
        type: SET_CHARGING_ON_START,
        chargingStart
    };
};

export const markAsCompleteCharge = (isComplete) => {
    return {
        type: MARK_AS_CHARGING_COMPLETE,
        isComplete
    };
};