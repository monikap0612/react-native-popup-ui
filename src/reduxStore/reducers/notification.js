import { get, omit } from 'lodash';
import {
    SET_NOTIFICATION_DATA,
} from 'reduxStore/actions/ActionTypes';

const INITIAL_STATE = {
    notificationConfig: null,
    notificationList: null,
};

const homeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_NOTIFICATION_DATA:
            const notificationConfig = omit(get(action, 'notificationData', null), 'NotificationList');
            const notificationList = get(action, 'notificationData.NotificationList', []);
            return {
                ...state,
                notificationConfig: notificationConfig,
                notificationList: notificationList
            };
       
        default:
            return state;
    }
}

export default homeReducer