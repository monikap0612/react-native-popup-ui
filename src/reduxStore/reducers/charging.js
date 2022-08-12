import { get } from 'lodash';
import {
    RESET_CHARGING_REDUX,
    SET_USER_SELECTED_CONNECTOR,
    SET_VERIFY_CHARGING_DATA,
    SET_CHARGING_ON_START,
    MARK_AS_CHARGING_COMPLETE
} from 'reduxStore/actions/ActionTypes';

const INITIAL_STATE = {
    connectorInfo: null,
    locationInfo: null,
    verifiedCharging: null,
    startChargingInfo: null,
    isChargeComplete: true
};

const homeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case RESET_CHARGING_REDUX:
            return {
                ...INITIAL_STATE,
            };
        case SET_USER_SELECTED_CONNECTOR:
            return {
                ...state,
                connectorInfo: get(action, 'connectorInfo.machineInfo', null),
                locationInfo: get(action, 'connectorInfo.locationInfo', null)
            };
        case SET_VERIFY_CHARGING_DATA:
            return {
                ...state,
                verifiedCharging: action.verifiedCharging
            };
        case SET_CHARGING_ON_START:
            return {
                ...state,
                startChargingInfo: action.chargingStart,
                isChargeComplete: false
            };
        case MARK_AS_CHARGING_COMPLETE:
            return {
                ...state,
                isChargeComplete: action.isComplete
            };
        default:
            return state;
    }
}

export default homeReducer