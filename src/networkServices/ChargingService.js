
import client from './HttpClient'
import { get } from 'lodash';
import { hideAlert } from 'react-native-easy-alert';

export default class ChargingService {

    // static async initiateTopUp(params) {
    //     let result = {};
    //     let token = get(params, 'userInfo.token', '');
    //     let apiBody = get(params, 'apiBody', '');

    //     try {
    //         hideAlert();
    //         let api_name = "home/initiateTopup";
    //         const response = await client.private_post(api_name, token, apiBody);
    //         result = JSON.parse(response)
    //     }
    //     catch (e) {
    //         //TODO: error logs
    //     }
    //     return result;
    // }

    static async requestChargingLocationInfo(params) {
        let result = {};
        let loginInfo = get(params, 'loginInfo', '');
        let apiBody = get(params, 'apiBody', '');

        try {
            hideAlert();
            let api_name = "home/chargingLocationInfo";
            const response = await client.authPostReq(api_name, loginInfo, apiBody);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async requestFindChargingLocations(params) {
        let result = {};
        let token = get(params, 'loginInfo.token', '');

        try {
            hideAlert();
            let api_name = "user/getChargingLocations";
            const response = await client.private_post(api_name, token);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }
}