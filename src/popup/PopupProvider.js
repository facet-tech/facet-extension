/*global chrome*/

import React, { useState, useEffect } from 'react';
import PopupContext from './PopupContext';

export default ({ children }) => {
    // email,id:  
    const [loggedInUser, setLoggedInUser] = useState({});
    const [shouldDisplayFacetizer, setShouldDisplayFacetizer] = useState(true);
    console.log('@provider? ', shouldDisplayFacetizer);
    useEffect(() => {
        const loadLocalStorage = () => {
            console.log('@RUnning localstorage');
            const facetKey = 'facet-settings';
            chrome.storage.sync.get(facetKey, function (obj) {
                console.log('@obj', obj);
                if (!obj) {
                    console.log('setting defaults!');
                    // set defaults
                    chrome.storage.sync.set({
                        [facetKey]: {
                            enabled: false
                        }
                    }, function () {
                        setShouldDisplayFacetizer(false);
                        console.log('Value is set TO FALSE');
                    });
                } else {
                    console.log('SETTING TO TRUE');
                    setShouldDisplayFacetizer(obj[facetKey]['enabled']);
                }
            });
        }
        loadLocalStorage();
    }, []);

    return <PopupContext.Provider value={{ loggedInUser, setLoggedInUser, shouldDisplayFacetizer, setShouldDisplayFacetizer }}>
        {children}
    </PopupContext.Provider>
}