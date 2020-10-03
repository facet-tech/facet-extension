/*global chrome*/
import React from 'react';

const loadLocalStorage = (setShouldDisplayFacetizer) => {
    const facetKey = 'facet-settings';
    chrome.storage && chrome.storage.sync.get(facetKey, function (obj) {
        if (!obj) {
            // set defaults
            chrome.storage && chrome.storage.sync.set({
                [facetKey]: {
                    enabled: false
                }
            }, function () {
                setShouldDisplayFacetizer(false);
            });
        } else {
            setShouldDisplayFacetizer(obj[facetKey]['enabled']);
        }
    });
}

export default loadLocalStorage;