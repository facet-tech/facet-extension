/*global chrome*/
import { LoginTypes } from './constant';

const facetKey = 'facet-settings';

/**
 * @param {setShouldDisplayFacetizer} setShouldDisplayFacetizer
 * @param {*} setIsPluginEnabled 
 * @param {*} setIsUserAuthenticated 
 */
const loadLocalStorage = async (setShouldDisplayFacetizer, setIsPluginEnabled, setIsUserAuthenticated) => {
    chrome.storage && chrome.storage.sync.get(facetKey, function (obj) {
        console.log('HI MOM', obj);
        if (!obj) {
            // setting defaults
            const cb1 = function () {
                setShouldDisplayFacetizer(false);
            };

            const cb2 = function () {
                setIsPluginEnabled(true);
            };

            const cb3 = function () {
                setIsUserAuthenticated(false);
            }
            setKeyInLocalStorage('showFacetizer', cb1);
            setKeyInLocalStorage('isPluginEnabled', true, cb2);
            setIsUserAuthenticated(LoginTypes.email, false, cb3);
        } else {
            setShouldDisplayFacetizer(obj[facetKey]['showFacetizer']);
            setIsPluginEnabled(obj[facetKey]['isPluginEnabled']);
            setIsUserAuthenticated(obj[facetKey][LoginTypes.email]);
        }
    });
}

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
        console.log(`updated object to local storage:`, res)
    });
}

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