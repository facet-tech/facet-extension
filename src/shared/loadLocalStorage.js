/*global chrome*/
import { isPluginEnabled, LoginTypes, showFacetizer, api } from './constant';

const facetKey = 'facet-settings';

/**
 * @param {setShouldDisplayFacetizer} setShouldDisplayFacetizer
 * @param {*} setIsPluginEnabled 
 * @param {*} setIsUserAuthenticated 
 */
// TODO clean up
const loadLocalStorage = async (setShouldDisplayFacetizer, setIsPluginEnabled, setIsUserAuthenticated, setWorkspaceId) => {
    chrome.storage && chrome.storage.sync.get(facetKey, function (obj) {
        try {
            if (!obj) {
                setKeyInLocalStorage(showFacetizer, false);
                setKeyInLocalStorage(isPluginEnabled, false);
            } else {
                setShouldDisplayFacetizer(obj[facetKey][showFacetizer]);
                setIsPluginEnabled(obj[facetKey][isPluginEnabled]);
                if (setIsUserAuthenticated) {
                    setIsUserAuthenticated(Boolean(obj[facetKey][LoginTypes.email]));
                }
                if (setWorkspaceId) {
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
    return new Promise((resolve, reject) => {
        try {
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
    chrome.storage.sync.clear(function () {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
}

export { getKeyFromLocalStorage, setKeyInLocalStorage, clearStorage };

export default loadLocalStorage;