/* global chrome */

import React, { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import get from 'lodash/get';
import { Auth } from 'aws-amplify';
import AppContext from './AppContext';
import isDevelopment from './utils/isDevelopment';
import {
  getFacet, getDomain, convertGetFacetResponseToMap, getOrPostDomain, triggerApiCall, saveFacets, getOrCreateWorkspace,
} from './services/facetApiService';
import loadLocalStorage, { clearStorage, getKeyFromLocalStorage, initSessionData, setKeyInLocalStorage } from './shared/loadLocalStorage';
import { api, ChromeRequestType, storage, HTTPMethods, authState as authStateConstant, APIUrl, defaultFacet } from './shared/constant';
import { loadInitialState } from './highlighter';
import AmplifyService from './services/AmplifyService';
import triggerDOMReload from './shared/popup/triggerDOMReload';
import $ from 'jquery';
import parsePath from './shared/parsePath';

const AppProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  // TODO these need to change during dev
  const [isPluginEnabled, setIsPluginEnabled] = isDevelopment() ? useState(true) : useState(false);
  const [isEnabled, setIsEnabled] = isDevelopment() ? useState(true) : useState(false);
  const [showSideBar, setShowSideBar] = isDevelopment() ? useState(true) : useState(false);
  const [loadingSideBar, setLoadingSideBar] = isDevelopment() ? useState(false) : useState(true);

  const [addedFacets, setAddedFacets] = useState(['Default-Facet']);
  const [canDeleteElement, setCanDeleteElement] = useState(false);
  const [disabledFacets, setDisabledFacets] = useState([]);
  const [newlyAddedFacet, setNewlyAddedFacet] = useState('Default-Facet');
  const [addedElements, setAddedElements] = useState(new Map());
  const [textToCopy, setTextToCopy] = useState(`<script src="${APIUrl.apiBaseURL}/facet.ninja.js?id={ID}"></script>`);

  const [selected, setSelected] = useState([]);
  const [selectedFacet, setSelectedFacet] = useState('Facet-1');
  const [facetMap, setFacetMap] = useState(new Map([['Facet-1', []]]));
  const [authObject, setAuthObject] = useState({ email: '', password: '' });
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [facetLabelMenu, setFacetMenuLabel] = useState(null);

  const handleClickMenuEl = (event, facetName) => {
    setMenuAnchorEl(event.currentTarget);
    setFacetMenuLabel(facetName);
  };

  const handleCloseMenuEl = () => {
    setMenuAnchorEl(null);
  };

  const onGotoClick = () => {
    const domPath = facetMap.get(selectedFacet) && facetMap.get(selectedFacet)[0]?.path;
    const element = $(domPath)[0];
    element?.scrollIntoView();
    handleCloseMenuEl();
  };

  const onDeleteDOMElement = (path) => {
    try {
      // TODO DOM-related stuff should be handled through highlighter
      const parsedPath = parsePath([path], false);
      const element = $(parsedPath[0])[0];
      element.style.setProperty('opacity', 'unset');
    } catch (e) {
      console.log('[ERROR] onDeleteElement', e);
    }
  };

  const onDeleteFacet = (facet) => {
    const facetValue = facetMap.get(facet);
    facetValue && facetValue.forEach((domElement) => {
      onDeleteDOMElement(domElement.path);
    });
    facetMap.delete(facet);
    setFacetMap(new Map(facetMap));
    const keys = [...facetMap.keys()];
    if (keys.length > 0) {
      setSelectedFacet(keys[keys.length - 1]);
    } else {
      setSelectedFacet(defaultFacet);
    }
  };
  // popup stuff
  // email,id:  
  const [loggedInUser, setLoggedInUser] = useState({});
  const [url, setUrl] = useState('');
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [workspaceId, setWorkspaceId] = useState(undefined);
  const [jwt, setJwt] = useState('');
  // deprecate this..
  const [loadLogin, setLoadLogin] = useState(false);
  const [currAuthState, setCurrAuthState] = useState(authStateConstant.signingIn);
  const login = async () => {
    const workspaceResponse = await getOrCreateWorkspace(email);
    setIsUserAuthenticated(true);
    await setKeyInLocalStorage(api.workspace.workspaceId, workspaceResponse.response.workspaceId);
    await setKeyInLocalStorage(storage.isPluginEnabled, true);
    await setKeyInLocalStorage(LoginTypes.email, email);
    triggerDOMReload();
  }

  const onLoginClick = (val) => {
    setLoadLogin(val);
  }

  const loadJWT = async () => {
    const jwt = await AmplifyService.getCurrentUserJTW();
    setJwt(jwt);
  }

  const signInExistingUser = async () => {
    try {
      const username = await getKeyFromLocalStorage(storage.username);
      const password = await getKeyFromLocalStorage(storage.password);
      await Auth.signIn(username, password);
      setCurrAuthState(authStateConstant.signedIn);
    } catch (e) {
      console.log('[ERROR][signInExistingUser]', e);
    }
  }

  useEffect(() => {
    loadJWT();
    signInExistingUser();
    loadLocalStorage(setIsPluginEnabled, setIsUserAuthenticated, setWorkspaceId);
  }, [setJwt]);

  /**
    * TODO this listener should probably live into the Provider
    */
  chrome && chrome.runtime.onMessage && chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      if (request.data === ChromeRequestType.GET_LOGGED_IN_USER) {
        const data = await AmplifyService.getCurrentSession();
        sendResponse({
          data,
        });
      }
    },
  );

  const onSaveClick = async () => {
    try {
      await saveFacets(facetMap, enqueueSnackbar);
      if (!isDevelopment()) {
        window.location.reload();
      }
    } catch (e) {
      console.log('[ERROR] [onSaveClick] ', e);
    }
  };

  const reset = async () => {
    try {
      const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
      const domainRes = await getOrPostDomain(workspaceId);

      const body = {
        domainId: domainRes.response.id,
        urlPath: window.location.pathname,
      };
      enqueueSnackbar('Facets reset.', { variant: 'success' });
      await triggerApiCall(HTTPMethods.DELETE, '/facet', body);
      if (!isDevelopment()) {
        window.location.reload();
      }
    } catch (e) {
      console.log('[ERROR]', e);
    }
  };

  useEffect(() => {
    (async () => {
      loadCopySnippet();

      const isPluginEnabledVal = await getKeyFromLocalStorage(storage.isPluginEnabled);
      if (!isPluginEnabledVal) {
        return;
      }
      const storageEmail = await getKeyFromLocalStorage(storage.username);
      const workspaceResponse = await getOrCreateWorkspace(storageEmail, false);
      const workspaceId = workspaceResponse?.response?.workspaceId;
      const domainResponse = await getDomain(window.location.hostname, workspaceId, false);
      const domainId = domainResponse?.response?.id;
      await initSessionData({ workspaceId, domainId });
      const getFacetRequest = await getFacet(domainId, window.location.pathname);
      if (getFacetRequest.status === 200) {
        const fMap = convertGetFacetResponseToMap(getFacetRequest.response);
        if (fMap.size > 0) {
          setSelectedFacet(fMap.entries().next().value[0]);
        }
        setFacetMap(new Map(fMap));
        loadInitialState(fMap);
      } else {
        setFacetMap(new Map([['Facet-1', []]]));
      }
      setLoadingSideBar(false);
    })();
  }, []);

  const onFacetAdd = (label) => {
    if (addedFacets.includes(label)) {
      enqueueSnackbar('Please choose a unique name for your Facet.', { variant: 'error' });
      return;
    }
    setAddedFacets([label, ...addedFacets]);
    setNewlyAddedFacet(label);
    enqueueSnackbar(`Facet "${label}" was created!`, { variant: 'success' });
    window.selectedDOM = 'main';
  };

  const logout = () => {
    clearStorage();
    Auth.signOut();
    setCurrAuthState(authStateConstant.signingIn);
    setJwt(undefined);
    window.close();
    triggerDOMReload();
  };

  const loadCopySnippet = async () => {
    try {
      const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);

      const loc = new URL(window.location.host);
      const domainRes = await getDomain(loc.hostname, workspaceId);

      const text = `<script src="${APIUrl.apiBaseURL}/facet.ninja.js?id=${domainRes?.response?.id}"></script>`;

      setTextToCopy(text);
      return text;
    } catch (e) {
      console.log('[ERROR]', e);
    }
  };

  // sharing stuff among content script
  window.addedElements = addedElements;
  window.setAddedElements = setAddedElements;
  window.enqueueSnackbar = enqueueSnackbar;
  return (
    <AppContext.Provider value={{
      onFacetAdd,
      addedFacets,
      setAddedFacets,
      newlyAddedFacet,
      setNewlyAddedFacet,
      addedElements,
      setAddedElements,
      canDeleteElement,
      setCanDeleteElement,
      disabledFacets,
      setDisabledFacets,
      showSideBar,
      setShowSideBar,
      isEnabled,
      setIsEnabled,
      isPluginEnabled,
      setIsPluginEnabled,
      enqueueSnackbar,
      facetMap,
      setFacetMap,
      selectedFacet,
      setSelectedFacet,
      loadingSideBar,
      setLoadingSideBar,
      onSaveClick,
      reset,
      authObject,
      setAuthObject,
      menuAnchorEl,
      setMenuAnchorEl,
      handleClickMenuEl,
      handleCloseMenuEl,
      logout,
      loadCopySnippet,
      textToCopy,
      facetLabelMenu,
      setFacetMenuLabel,
      onGotoClick,
      selected,
      setSelected,
      onDeleteFacet,
      onDeleteDOMElement,

      loggedInUser, setLoggedInUser, url, setUrl, login, isUserAuthenticated, setIsUserAuthenticated,
      workspaceId, email, setEmail, loadLogin, setLoadLogin, onLoginClick,
      currAuthState, setCurrAuthState, jwt, setJwt
    }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
