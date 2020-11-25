/*global chrome*/
import isDevelopment from '../utils/isDevelopment';
import { isPluginEnabled, LoginTypes, api } from './constant';

const facetKey = 'facet-settings';

/**
 * @param {*} setIsPluginEnabled 
 * @param {*} setIsUserAuthenticated 
 */
// TODO clean up
const loadLocalStorage = async (setIsPluginEnabled, setIsUserAuthenticated, setWorkspaceId) => {
    chrome?.storage?.sync?.get(facetKey, function (obj) {
        try {
            if (!obj) {
                setKeyInLocalStorage(isPluginEnabled, false);
            } else {
                setIsPluginEnabled(obj[facetKey][isPluginEnabled]);
                if (setIsUserAuthenticated && obj[facetKey]) {
                    setIsUserAuthenticated(Boolean(obj[facetKey][LoginTypes.email]));
                }
                if (setWorkspaceId && obj[facetKey]) {
                    setWorkspaceId(obj[facetKey][api.workspace.workspaceId])
                }
            }
        } catch (e) {
            console.log('[STORAGE][ERROR]', e);
        }
    });
}

/**
 * Returns all the values from local storage
 */
const getLocalStorageObject = async () => {
    return new Promise((resolve, reject) => {
        try {
            chrome && chrome.storage && chrome.storage.sync.get(facetKey, function (value) {
                resolve(value[facetKey]);
            })
        }
        catch (ex) {
            reject(ex);
        }
    });
}

/**
 * @param {key} key stored in local storage for 'facet-settings'
 */
const getKeyFromLocalStorage = async (key) => {
    if (isDevelopment()) {
        return true;
    }
    return new Promise((resolve, reject) => {
        try {
            if (!chrome || !chrome.storage) {
                resolve(undefined);
            }
            chrome && chrome.storage && chrome.storage.sync.get(facetKey, function (value) {
                resolve(value[facetKey][key]);
            })
        }
        catch (ex) {
            reject(ex);
        }
    });
};

/**
 * Updates key in storage
 * 
 * @param {*} key 
 * @param {*} value 
 */
const setKeyInLocalStorage = async (key, value) => {
    const localStorageObj = await getLocalStorageObject();
    const aboutToSet = {
        [facetKey]: {
            ...localStorageObj,
            [key]: value
        }
    };


    chrome.storage && chrome.storage.sync.set(aboutToSet, async function () {
        const res = await getLocalStorageObject();
    });
}

/**
 * Clears the local storage
 */
const clearStorage = () => {
    chrome?.storage?.sync?.clear(function () {
        var error = chrome?.runtime?.lastError;
        if (error) {
            console.error(error);
        }
    });
}

export { getKeyFromLocalStorage, setKeyInLocalStorage, clearStorage };

export default loadLocalStorage;