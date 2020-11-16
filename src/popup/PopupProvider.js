/*global chrome*/

import React, { useState, useEffect } from 'react';
import PopupContext from './PopupContext';
import loadLocalStorage, { setKeyInLocalStorage } from '../shared/loadLocalStorage'
import { LoginTypes, storage, api } from '../shared/constant';
import { getOrCreateWorkspace } from '../services/facetApiService';

export default ({ children }) => {
    // email,id:  
    const [loggedInUser, setLoggedInUser] = useState({});
    const [url, setUrl] = useState('');
    const [isPluginEnabled, setIsPluginEnabled] = useState(true);
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [workspaceId, setWorkspaceId] = useState(undefined);

    const login = async () => {
        const workspaceResponse = await getOrCreateWorkspace(email);
        setIsUserAuthenticated(true);
        await setKeyInLocalStorage(api.workspace.workspaceId, workspaceResponse.response.workspaceId);
        await setKeyInLocalStorage(storage.isPluginEnabled, true);
        await setKeyInLocalStorage(LoginTypes.email, email);
    }

    useEffect(() => {
        loadLocalStorage(setIsPluginEnabled, setIsUserAuthenticated);

        const loadURL = () => {
            chrome.tabs && chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
                let websiteUrl = tabs[0] && tabs[0].url;
                setUrl(websiteUrl);
            });
        }

        loadURL();
        loadLocalStorage(setIsPluginEnabled, setIsUserAuthenticated, setWorkspaceId);
    }, [setIsPluginEnabled, setIsUserAuthenticated, setWorkspaceId]);

    return <PopupContext.Provider value={{
        loggedInUser, setLoggedInUser, url, setUrl, isPluginEnabled,
        setIsPluginEnabled, login, isUserAuthenticated, setIsUserAuthenticated,
        workspaceId, email, setEmail
    }}>
        {children}
    </PopupContext.Provider>
}