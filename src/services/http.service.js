import axios from 'axios'
import { storageService } from './storage.service'
import { constant } from "../configs/constant";
import UserAgent from 'react-native-user-agent';
import publicIP from 'react-native-public-ip';
// import DeviceInfo from 'react-native-device-info';
export const httpService = {
    get: async (url) => {
        try {
            let publicIp = await publicIP();
            let token = await storageService.getItem('auth_token');
            let headers = new Headers({
                'Authorization': 'Bearer ' + token.authToken,
                'Content-Type': 'application/json;charset=UTF-8',
                'user-agent': UserAgent.userAgent,
                'FNX-IP-ADDRESS': publicIp
                
            })
            console.log(token.authToken,"authToken")
            return axios.get(url, {
                headers: headers.map
            });

        } catch (error) {

        }


    },
    post: async (url, data) => {
        try {
            let token = await storageService.getItem('auth_token');
            let publicIp = await publicIP();
            let headers = new Headers({
                'Authorization': 'Bearer ' + token.authToken,
                'Content-Type': 'application/json',
                'user-agent': UserAgent.userAgent,
                'FNX-IP-ADDRESS': publicIp
            })
            console.log(token.authToken,"header autoken")
            return axios.post(url, data, {
                headers: headers.map
            });
        } catch (error) {

        }

    },
    postUrlEncode_FormPart: async (url, data) => {
        let publicIp = await publicIP();
        let headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'user-agent': UserAgent.userAgent,
            'FNX-IP-ADDRESS': publicIp
        })
        return fetch(url, {
            method: 'post',
            body: data,
            headers: headers
        })
            .then(res => res.json())
            .catch(err => { });
    },
    post_without_token: async (url, data) => {
        let publicIp = await publicIP();
        let headers = {
            'Content-Type': 'application/json',
            'user-agent': UserAgent.userAgent,
            'FNX-IP-ADDRESS': publicIp
        }
        try {
           
            let response = await axios.post(url, data, {
                headers: headers
            })
            if (response.data) {
                return response.data;
            }


            return null;
        } catch (error) {

        }

    },
    get_without_token: async (url) => {
        let publicIp = await publicIP();
        let headers = {
            'Content-Type': 'application/json',
            'user-agent': UserAgent.userAgent,
            'FNX-IP-ADDRESS': publicIp
        }
        try {
            let response = await axios.get(url, {
                headers: headers
            })
            if (response.data) {
                return response.data;
            }
            return null;
        } catch (error) {

        }

    },
    onError: (err, nav) => {
        const error = err.response;
        if (error.status === 401) {
            storageService.removeItem(constant.STORAGEKEY.AUTH_TOKEN);
            nav.navigate("Login", nav.state.routeName);
        }
    }
}
