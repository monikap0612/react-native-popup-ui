
import EnvironmentStore from 'utils/EnvironmentStore'
import RNFetchBlob from 'rn-fetch-blob'
import { get } from 'lodash';
import axios from 'axios';

export default class HttpClient {

    // return url with baseUrl
    static url(path) {
        var host = EnvironmentStore.getApiHost('test')
        return host + "/" + path
    }

    // get method
    static async get(path) {
        try {
            let url = this.url(path);
            let response

            // send GET request
            await RNFetchBlob.fetch('GET', url, {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
                .then((res) => {
                    response = res.json();
                })
                .catch((errorMessage, statusCode) => {
                    response = null;
                    // console.log("Service issue:", errorMessage)
                })
            return response // return response
        } catch (error) {
            // console.log("Service issue:", error)
        }
    }

    // post method
    static async post(path, data) {
        try {
            let url = this.url(path)
            let response

            // send POST request
            await RNFetchBlob.fetch('POST', url, {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, data)
                .then((res) => {
                    response = res.text();
                })
                .catch((errorMessage, statusCode) => {
                    response = null;
                    // console.log("Service issue:", errorMessage)
                })
            return response
        } catch (error) {
            // console.log("Service issue:", error)
        }
    }

    static async private_post(path, token, data) {
        try {
            let url = this.url(path)
            let response

            // send POST request
            await RNFetchBlob.fetch('POST', url, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token
            }, data)
                .then((res) => {
                    response = res.text();
                })
                .catch((errorMessage, statusCode) => {
                    response = null;
                    // console.log("Service issue:", errorMessage)
                })
            return response
        } catch (error) {
            // console.log("Service issue:", error)
        }
    }

    static async authPostReq(path, loginInfo, data) {
        try {
            let url = this.url(path)
            let response

            const userId = get(loginInfo, 'userid', null);
            const userToken = get(loginInfo, 'token', null);

            // send POST request
            await RNFetchBlob.fetch('POST', url, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': userToken,
                'userid': userId

            }, data)
                .then((res) => {
                    response = res.text();
                })
                .catch((errorMessage, statusCode) => {
                    response = null;
                    // console.log("Service issue:", errorMessage)
                })
            return response
        } catch (error) {
            // console.log("Service issue:", error)
        }
    }

    static async axiosPost(path, token, userId, data) {
        let url = this.url(path)

        const headers = {
            'token': token,
            'userid': userId
        }

        axios.post(url, data, {
            headers: headers
        })
            .then((response) => {
                // console.log(response)
            })
            .catch((error) => {
            })
    }

    static async public_post(path, token, userId, data) {
        try {
            let url = this.url(path)
            let response

            // send POST request
            await RNFetchBlob.fetch('POST', url, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': token,
                'userid': userId
            }, data)
                .then((res) => {
                    response = res.text();
                })
                .catch((errorMessage, statusCode) => {
                    response = null;
                    // console.log("Service issue:", errorMessage)
                })
            return response
        } catch (error) {
            // console.log("Service issue:", error)
        }
    }
}

