
import client from './HttpClient'
import { get } from 'lodash';
import { checkInternet, showInternetLostAlert } from './networkHelper';
import { hideAlert } from 'react-native-easy-alert';

export default class TopUpService {

    static async initiateTopUp(params) {
        let result = {};
        let loginInfo = get(params, 'loginInfo', '');
        let apiBody = get(params, 'apiBody', '');

        try {
            hideAlert();
            let api_name = "home/initiateTopup";
            const response = await client.authPostReq(api_name, loginInfo, apiBody);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }

    static async requestTopUpVerify(params) {
        let result = {};
        let token = get(params, 'loginInfo.token', '');
        let apiBody = get(params, 'apiBody', '');

        try {
            hideAlert();
            let api_name = "home/verifyTopup";
            const response = await client.private_post(api_name, token, apiBody);
            result = JSON.parse(response)
        }
        catch (e) {
            //TODO: error logs
        }
        return result;
    }
}