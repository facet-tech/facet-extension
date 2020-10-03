/*global chrome*/

import React, { useState, useEffect } from 'react';
import PopupContext from './PopupContext';
import loadLocalStorage from '../shared/loadLocalStorage'

export default ({ children }) => {
    // email,id:  
    const [loggedInUser, setLoggedInUser] = useState({});
    const [shouldDisplayFacetizer, setShouldDisplayFacetizer] = useState(true);
    const [url, setUrl] = useState('');

    useEffect(() => {

        loadLocalStorage(setShouldDisplayFacetizer);

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