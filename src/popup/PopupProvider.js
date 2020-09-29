import React, { useState, useEffect } from 'react';
import PopupContext from './PopupContext';

export default ({ children }) => {

    // email,id:  
    const [loggedInUser, setLoggedInUser] = useState({});
    const [shouldDisplayFacetizer, setShouldDisplayFacetizer] = useState(true);

    useEffect(() => {
        const loadLocalStorage = () => {
            const facetKey = 'facet-settings';
            chrome.storage.sync.get(facetKey, function (obj) {
                console.log('oBj', obj);
                if (!obj) {
                    console.log('setting defaults!');
                    // set defaults
                    chrome.storage.sync.set({
                        [facetKey]: {
                            enabled: false
                        }
                    }, function () {
                        console.log('Value is set.');
                    });
                }
            });
            loadLocalStorage();
        }

        return <PopupContext.Provider value={{ loggedInUser, setLoggedInUser, shouldDisplayFacetizer, setShouldDisplayFacetizer }}>
            {children}
        </PopupContext.Provider>
    }