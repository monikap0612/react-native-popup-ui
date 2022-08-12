import { get } from 'lodash';
import {
    SET_HOME_DETAILS,
    UPDATE_USER_WALLET_BALANCE,
    SET_USER_CURRENT_LOCATION
} from 'reduxStore/actions/ActionTypes';

const INITIAL_STATE = {
    homeDetails: null,
    userCurrentLocation: null
};

const homeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_HOME_DETAILS:
            return {
                ...state,
                homeDetails: action.homeDetails
            };
        case UPDATE_USER_WALLET_BALANCE:
            const currentBalance = parseInt(get(state, 'homeDetails.wallet', '0'));
            const updatedBalance = parseInt(get(action, 'balance', '0'));
            const validateBalance = (currentBalance + updatedBalance) > 0 ? (currentBalance + updatedBalance) : "0";
            return {
                ...state,
                homeDetails: {
                    ...state.homeDetails,
                    wallet: validateBalance
                }
            };
        case SET_USER_CURRENT_LOCATION:
            return {
                ...state,
                userCurrentLocation: action.userLocation
            };
        default:
            return state;
    }
}

export default homeReducer