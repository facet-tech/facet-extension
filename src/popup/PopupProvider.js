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
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [selectedWayOfLogin, setSelectedWayOfLogin] = useState('')
    const [email, setEmail] = useState('');

    const login = () => {
        // api call goes here
        setIsUserAuthenticated(true);
    }

    useEffect(() => {
        loadLocalStorage(setShouldDisplayFacetizer, setIsPluginEnabled, setIsUserAuthenticated);

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
        loggedInUser, setLoggedInUser, shouldDisplayFacetizer,
        setShouldDisplayFacetizer, url, setUrl, isPluginEnabled,
        setIsPluginEnabled, selectedWayOfLogin, setSelectedWayOfLogin,
        login, isUserAuthenticated, setIsUserAuthenticated, email, setEmail
    }}>
        {children}
    </PopupContext.Provider>
}