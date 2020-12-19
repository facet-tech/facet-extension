/* global chrome */

import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Auth } from 'aws-amplify';
import AppContext from './AppContext';
import isDevelopment from './utils/isDevelopment';
import {
  getFacet, getDomain, convertGetFacetResponseToMap, getOrPostDomain, triggerApiCall, saveFacets, getOrCreateWorkspace,
} from './services/facetApiService';
import loadLocalStorage, { clearStorage, getKeyFromLocalStorage, initSessionData, setKeyInLocalStorage } from './shared/loadLocalStorage';
import { api, storage, HTTPMethods, authState as authStateConstant, APIUrl, defaultFacet, snackbar, domIds, appId } from './shared/constant';
import { loadInitialState } from './highlighter';
import AmplifyService from './services/AmplifyService';
import triggerDOMReload from './shared/popup/triggerDOMReload';
import parsePath from './shared/parsePath';
import $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';
import useSelectedFacet from './shared/hooks/useSelectedFacet';
import useFacetMap from './shared/hooks/useFacetMap';

const AppProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  // TODO these need to change during dev
  const [isPluginEnabled, setIsPluginEnabled] = isDevelopment() ? useState(true) : useState(false);
  const [showSideBar, setShowSideBar] = isDevelopment() ? useState(true) : useState(false);
  const [loadingSideBar, setLoadingSideBar] = isDevelopment() ? useState(false) : useState(true);

  const [addedFacets, setAddedFacets] = useState(['Default-Facet']);
  const [canDeleteElement, setCanDeleteElement] = useState(false);
  const [disabledFacets, setDisabledFacets] = useState([]);
  const [newlyAddedFacet, setNewlyAddedFacet] = useState('Default-Facet');
  const [addedElements, setAddedElements] = useState(new Map());
  const [textToCopy, setTextToCopy] = useState(`<script src="${APIUrl.apiBaseURL}/facet.ninja.js?id={ID}"></script>`);

  const [expanded, setExpanded] = useState([]);
  const [facetMap, setFacetMap] = useFacetMap();
  const [authObject, setAuthObject] = useState({ email: '', password: '' });
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [facetLabelMenu, setFacetMenuLabel] = useState(null);
  const [selectedFacet, setSelectedFacet] = useSelectedFacet();

  const handleClickMenuEl = (event, facetName) => {
    setMenuAnchorEl(event.currentTarget);
    setFacetMenuLabel(facetName);
  };

  const handleCloseMenuEl = () => {
    setMenuAnchorEl(null);
  };

  const onGotoClick = (domPath) => {
    $(domPath).effect("shake", { direction: "up", times: 4, distance: 10 }, 1000);
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

  const [loggedInUser, setLoggedInUser] = useState({});
  const [url, setUrl] = useState('');
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [workspaceId, setWorkspaceId] = useState(undefined);
  const [jwt, setJwt] = useState('');
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

  const persistLogin = async (email, password) => {
    await setKeyInLocalStorage(storage.isPluginEnabled, true);
    await setKeyInLocalStorage(storage.username, email);
    await setKeyInLocalStorage(storage.password, password);
    await Auth.signIn(email, password);
    const workspaceResponse = await getOrCreateWorkspace(email);
    await setKeyInLocalStorage(api.workspace.workspaceId,
      workspaceResponse?.response?.workspaceId);
    setCurrAuthState(authStateConstant.signedIn);
    setAuthObject({
      ...authObject,
      email,
    });
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

  const loadCopySnippet = async () => {
    try {
      const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
      const domainRes = await getDomain(window.location.hostname, workspaceId);
      const text = `<script src="${APIUrl.apiBaseURL}/facet.ninja.js?id=${domainRes.response.id}"></script>`;
      setTextToCopy(text);
    } catch (e) {
      console.log('[ERROR][loadCopySnippet]', e);
    }
  };

  useEffect(() => {
    loadJWT();
    signInExistingUser();
    loadLocalStorage(setIsPluginEnabled, setIsUserAuthenticated, setWorkspaceId);
    loadCopySnippet();
  }, [setJwt]);

  const onSaveClick = async () => {
    try {
      await saveFacets(facetMap, enqueueSnackbar);
    } catch (e) {
      console.log('[ERROR] [onSaveClick] ', e);
    }
  };

  const reset = async () => {
    try {
      if (!confirm("Are you sure you want to delete all your facets?")) {
        return;
      }

      const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
      const domainRes = await getOrPostDomain(workspaceId);

      const body = {
        domainId: domainRes.response.id,
        urlPath: window.location.pathname,
      };
      enqueueSnackbar({
        message: 'Facets reset.',
        variant: snackbar.success.text
      });
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
      // not loading facetizer for extension-related pages
      if (window.location.hostname === appId) {
        return;
      }
      loadCopySnippet();

      const isPluginEnabledVal = await getKeyFromLocalStorage(storage.isPluginEnabled);
      // dirty quick fix
      const isAuthenticationDOM = document.getElementById(domIds.authentication);
      const isPopup = document.getElementById(domIds.popup);
      if (!isPluginEnabledVal || isAuthenticationDOM || isPopup) {
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
      enqueueSnackbar({
        message: 'Please choose a unique name for your Facet.',
        variant: snackbar.error.text
      });
      return;
    }
    setAddedFacets([label, ...addedFacets]);
    setNewlyAddedFacet(label);
    enqueueSnackbar({
      message: `Facet "${label}" was created!`,
      variant: snackbar.success.text
    });
    window.selectedDOM = 'main';
  };

  const onFacetClick = (labelText) => {
    // get around buggy behavior on opened menu
    if (menuAnchorEl) {
      handleCloseMenuEl();
      return;
    }
    setExpanded([labelText]);
    setSelectedFacet(labelText);
  }

  const logout = () => {
    clearStorage();
    Auth.signOut();
    setCurrAuthState(authStateConstant.signingIn);
    setJwt(undefined);
    window.close();
    triggerDOMReload();
  };

  const addFacet = (autoNumber = facetMap.size + 1) => {
    const newName = `Facet-${autoNumber}`;
    if (facetMap.get(newName)) {
      addFacet(autoNumber + 1);
      return;
    }
    setFacetMap(facetMap.set(newName, []));
    setSelectedFacet(newName);
    setExpanded([newName]);
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
      onDeleteFacet,
      onDeleteDOMElement,
      expanded,
      setExpanded,
      onFacetClick,
      addFacet,
      persistLogin,

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
