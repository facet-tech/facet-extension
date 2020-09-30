/*global chrome*/

import React, { useState, useEffect } from 'react';
import PopupContext from './PopupContext';

export default ({ children }) => {
    // email,id:  
    const [loggedInUser, setLoggedInUser] = useState({});
    const [shouldDisplayFacetizer, setShouldDisplayFacetizer] = useState(true);
    const [url, setUrl] = useState('');

    console.log('@provider? ', shouldDisplayFacetizer);
    useEffect(() => {
        const loadLocalStorage = () => {
            console.log('@RUnning localstorage');
            const facetKey = 'facet-settings';
            chrome.storage && chrome.storage.sync.get(facetKey, function (obj) {
                console.log('@obj', obj);
                if (!obj) {
                    console.log('setting defaults!');
                    // set defaults
                    chrome.storage && chrome.storage.sync.set({
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
        const loadURL = () => {
            chrome.tabs && chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
                let websiteUrl = tabs[0].url;
                setUrl(websiteUrl);
            });
        }

        loadURL();
        loadLocalStorage();
    }, []);


    return <PopupContext.Provider value={{
        loggedInUser, setLoggedInUser,
        shouldDisplayFacetizer, setShouldDisplayFacetizer,
        url, setUrl
    }}>
        {children}
    </PopupContext.Provider>
}