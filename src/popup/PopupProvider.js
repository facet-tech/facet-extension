/*global chrome*/

import React, { useState, useEffect } from 'react';
import PopupContext from './PopupContext';
import loadLocalStorage from '../shared/loadLocalStorage'

export default ({ children }) => {
    // email,id:  
    const [loggedInUser, setLoggedInUser] = useState({});
    const [shouldDisplayFacetizer, setShouldDisplayFacetizer] = useState(false);
    const [url, setUrl] = useState('');
    const [isPluginEnabled, setIsPluginEnabled] = useState(false);

    // THIS NEEDS TO RUN EVERYTIME.
    useEffect(() => {
        loadLocalStorage(setShouldDisplayFacetizer, setIsPluginEnabled);

        const loadURL = () => {
            chrome.tabs && chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
                let websiteUrl = tabs[0] && tabs[0].url;
                setUrl(websiteUrl);
            });
        }

        loadURL();
        loadLocalStorage();
    }, [setShouldDisplayFacetizer, setIsPluginEnabled]);

    return <PopupContext.Provider value={{
        loggedInUser, setLoggedInUser,
        shouldDisplayFacetizer, setShouldDisplayFacetizer,
        url, setUrl, isPluginEnabled, setIsPluginEnabled
    }}>
        {children}
    </PopupContext.Provider>
}