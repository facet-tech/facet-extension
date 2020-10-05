/*global chrome*/

const facetKey = 'facet-settings';

const loadLocalStorage = async (setShouldDisplayFacetizer, setIsPluginEnabled) => {
    chrome.storage && chrome.storage.sync.get(facetKey, function (obj) {
        if (!obj) {
            // setting defaults
            const cb1 = function () {
                setShouldDisplayFacetizer(false);
            };

            const cb2 = function () {
                setIsPluginEnabled(true);
            };
            setKeyInLocalStorage('showFacetizer', cb1);
            setKeyInLocalStorage('isPluginEnabled', true, cb2);
        } else {
            setShouldDisplayFacetizer(obj[facetKey]['showFacetizer']);
            setIsPluginEnabled(obj[facetKey]['isPluginEnabled']);
        }
    });
}

const getLocalStorageObject = async () => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(facetKey, function (value) {
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
            chrome.storage.sync.get(facetKey, function (value) {
                resolve(value[facetKey][key]);
            })
        }
        catch (ex) {
            reject(ex);
        }
    });
};

const setKeyInLocalStorage = async (key, value) => {
    const spreaddd = await getLocalStorageObject();
    const aboutToSet = {
        [facetKey]: {
            ...spreaddd,
            [key]: value
        }
    };

    chrome.storage && chrome.storage.sync.set(aboutToSet, async function () {
        const res = await getLocalStorageObject();
        console.log(`updated object to local storage:`, res)
    });
}

export { getKeyFromLocalStorage, setKeyInLocalStorage };

export default loadLocalStorage;