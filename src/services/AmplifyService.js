/*global chrome*/
import { ChromeRequestType, storage } from '../shared/constant';
import { Auth } from "aws-amplify";
import { getKeyFromLocalStorage } from '../shared/loadLocalStorage';

class AmplifyService {
    /**
     * Promise wrapper for chrome.tabs.sendMessage
     * @returns {Promise}
     * 
     * Request is retried 3 times maximum
     */
    static sendMessagePromise = (counter = 0) => {
        return new Promise((resolve, reject) => {
            chrome?.runtime?.sendMessage({
                data: ChromeRequestType.GET_LOGGED_IN_USER
            }, async function (response) {
                if (!response) {
                    const email = await getKeyFromLocalStorage(storage.username);
                    const password = await getKeyFromLocalStorage(storage.password);
                    await Auth.signIn(email, password);
                    let ans = await AmplifyService.getCurrentSession();
                    if (!ans) {
                        if (counter > 3) {
                            resolve(undefined);
                        }
                        sendMessagePromise(counter + 1);
                    }
                    resolve(ans);
                }
                resolve(response && response.data);
            });
        })
    }

    static getCurrentUserJTW = async () => {
        try {
            let ans = await AmplifyService.getCurrentSession();
            if (ans) {
                return ans;
            }
            const jwtToken = await this.sendMessagePromise();
            return jwtToken;

        } catch (e) {
            console.log('[ERROR][getCurrentUserJTW]', e)
            throw e;
        }
    }

    static getCurrentSession = async () => {
        try {
            const result = await Auth.currentSession();
            const jwtToken = result?.accessToken?.jwtToken;
            return jwtToken;
        } catch (e) {
            console.log('[ERROR][getCurrentSession]', e);
            throw e;
        }
    }
}

export default AmplifyService;