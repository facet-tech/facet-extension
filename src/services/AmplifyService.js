/*global chrome*/
import { ChromeRequestType, storage } from '../shared/constant';
import { Auth } from "aws-amplify";
import { getKeyFromLocalStorage } from '../shared/loadLocalStorage';

class AmplifyService {

    static sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Promise wrapper for chrome.tabs.sendMessage
     * @returns {Promise}
     * 
     * Request is retried @param ${counter} times
     */
    static sendMessagePromise = (counter = 0) => {
        return new Promise((resolve, reject) => {
            chrome?.runtime?.sendMessage({
                data: ChromeRequestType.GET_LOGGED_IN_USER
            }, async function (response) {
                chrome.storage && chrome.storage.sync.get('facet-settings', function (obj) {
                    console.log('[local storage]:', obj);
                });
                if (!response) {
                    await AmplifyService.sleep(2000);
                    const email = await getKeyFromLocalStorage(storage.username);
                    const password = await getKeyFromLocalStorage(storage.password);
                    await Auth.signIn(email, password);
                    let ans = await AmplifyService.getCurrentSession();
                    if(!ans) {
                        if(counter>3) {
                            resolve(undefined);
                        }
                        sendMessagePromise(counter+1);
                    }
                    resolve(ans);
                }
                resolve(response && response.data);
            });
        })
    }

    // TODO build retry logic here
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