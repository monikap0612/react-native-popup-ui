import {
    SET_NOTIFICATION_DATA,
} from './ActionTypes';


export const setNotificationData = (notificationData) => {
    return {
        type: SET_NOTIFICATION_DATA,
        notificationData
    };
};