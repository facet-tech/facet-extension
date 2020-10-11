/*global chrome*/

import React, { useState, useEffect } from 'react';
import PopupContext from './PopupContext';
import loadLocalStorage, { setKeyInLocalStorage } from '../shared/loadLocalStorage'
import { LoginTypes, storage, api } from '../shared/constant';
import { constructPayload, triggerApiCall, getOrCreateWorkspace } from '../services/facetApiService';

export default ({ children }) => {
    // email,id:  
    const [loggedInUser, setLoggedInUser] = useState({});
    const [shouldDisplayFacetizer, setShouldDisplayFacetizer] = useState(false);
    const [url, setUrl] = useState('');
    const [isPluginEnabled, setIsPluginEnabled] = useState(true);
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [workspaceId, setWorkspaceId] = useState(undefined);

    const login = async () => {
        // api call goes here
        // const res1 = await triggerApiCall('POST', '/workspace', body1);
        const res1 = await getOrCreateWorkspace(email);
        // const res2 = await res1.json();
        // const res = await triggerApiCall('POST', '/user', body);
        setIsUserAuthenticated(true);
        await setKeyInLocalStorage(storage.isPluginEnabled, true);
        await setKeyInLocalStorage(LoginTypes.email, email);
        await setKeyInLocalStorage(api.workspace.workspaceId, res1.id);
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
        loadLocalStorage(setShouldDisplayFacetizer, setIsPluginEnabled, setIsUserAuthenticated, setWorkspaceId);
    }, [setShouldDisplayFacetizer, setIsPluginEnabled, setIsUserAuthenticated, setWorkspaceId]);

    return <PopupContext.Provider value={{
        loggedInUser, setLoggedInUser, shouldDisplayFacetizer,
        setShouldDisplayFacetizer, url, setUrl, isPluginEnabled,
        setIsPluginEnabled, login, isUserAuthenticated, setIsUserAuthenticated,
        email, setEmail
    }}>
        {children}
    </PopupContext.Provider>
}