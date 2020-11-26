/*global chrome*/
import { ChromeRequestType } from '../shared/constant';
import { Auth } from "aws-amplify";

export default class {

    /**
     * * Promise wrapper for chrome.tabs.sendMessage
     * @returns {Promise}
     */
    static sendMessagePromise = () => {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                data: ChromeRequestType.GET_LOGGED_IN_USER
            }, function (response) {
                resolve(response && response.data);
            });
        })
    }

    static getCurrentUserJTW = async () => {
        try {
            const jwtToken = await this.sendMessagePromise();
            return jwtToken;

        } catch (e) {
            console.log('[ERROR][getCurrentUserJTW]', e)
            return undefined;
        }
    }

    static getCurrentSession = async () => {
        try {
            const result = await Auth.currentSession();
            const jwtToken = result?.accessToken?.jwtToken;
            return jwtToken;
        } catch (e) {
            console.log('[ERROR][getCurrentUserJTW]', e)
            return undefined;
        }
    }
}