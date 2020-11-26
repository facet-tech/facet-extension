/*global chrome*/
import { ChromeRequestType, storage } from '../shared/constant';
import { Auth } from "aws-amplify";
import { getKeyFromLocalStorage } from '../shared/loadLocalStorage';

class AmplifyService {

    /**
     * * Promise wrapper for chrome.tabs.sendMessage
     * @returns {Promise}
     */
    static sendMessagePromise = () => {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                data: ChromeRequestType.GET_LOGGED_IN_USER
            }, async function (response) {
                if (!response) {
                    const email = await getKeyFromLocalStorage(storage.username);
                    const password = await getKeyFromLocalStorage(storage.password);
                    await Auth.signIn(email, password);
                    let ans = await AmplifyService.getCurrentSession();
                    resolve(ans);
                }
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

export default AmplifyService;