
import client from './HttpClient'
import { get } from 'lodash';
import { checkInternet, showInternetLostAlert } from './networkHelper';
import { hideAlert } from 'react-native-easy-alert';

export default class UserService {

    static async userLogin(params) {
        let result = {};
        try {
            hideAlert();
            let api_name = "home/userFirebaseLogin";
            const response = await client.post(api_name, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async getAllVehicalBrand(data) {
        let token = get(data, 'token', '')
        let result = {};
        try {
            hideAlert();
            let api_name = "user/getVehicleBrandByFilter";
            const response = await client.private_post(api_name, token);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async getVehicleModelbyBrandID(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "user/getVehicleModelByBrand";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async getHomePageDetails(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/getHomePageDetails";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async getUserProfile(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/getUserProfile";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async updateUserProfile(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/updateProfile";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async getVehicleList(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "user/getUserVehicleLists";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async addVehical(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "user/addUserVehicle";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async getNotificationList(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/listNotification";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async updateNotificationStatus(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/readNotification";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async searchCharginLocation(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/searchChargingLocation";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async reportCharginLocation(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/reportChargingLocation";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async allFavChargingLocations(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/listAllFavourites";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async getChargingLocations(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "user/getChargingLocations";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async getChargingLocationInfo(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/chargingLocationInfo";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async addFavChargingLocations(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/bookmarkChargingLocation";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async getFAQListData(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/faqList";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async contactUs(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/contactUs";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async connectorSelection(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/connectorSelection";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async initiateChargingFlow(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/initiateChargingFlow";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async verifyChargingInfo(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/verifyChargingInformation";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async connectorLocking(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/connectorLocking";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async startCharging(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/startCharging";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async stopCharging(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/stopCharging";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async chargingDetails(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/userChargingDetails";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async syncChargingDetails(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/syncChargingData";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async getChargingHistory(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/userChargingHistory";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async getTransactionHistory(data, params) {
        let token = get(data, 'token', '');
        let userId = get(data, 'userid', '')

        let result = {};
        try {
            hideAlert();
            let api_name = "home/getTopup";
            const response = await client.public_post(api_name, token, userId, params);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }
}
