/* global chrome */

import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Auth } from 'aws-amplify';
import AppContext from './AppContext';
import isDevelopment from './utils/isDevelopment';
import {
  getFacet, convertGetFacetResponseToMap, getOrPostDomain, triggerApiCall, saveFacets, getOrCreateWorkspace, hasWhitelistedDomain, getGlobalArrayFromFacetResponse,
} from './services/facetApiService';
import loadLocalStorage, { clearStorage, getKeyFromLocalStorage, initSessionData, setKeyInLocalStorage } from './shared/loadLocalStorage';
import { api, storage, HTTPMethods, authState as authStateConstant, APIUrl, defaultFacetName, snackbar, domIds, appId, isPluginEnabled as isPluginEnabledConstant, ChromeRequestType, cookieKeys } from './shared/constant';
import { loadInitialStateInDOM, performDOMTransformation, isSelectorValid, scriptHasAlreadyBeenInjected } from './highlighter';
import AmplifyService from './services/AmplifyService';
import triggerDOMReload from './shared/popup/triggerDOMReload';
import parsePath from './shared/parsePath';
import $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';
import useSelectedFacet from './shared/hooks/useSelectedFacet';
import useFacetMap from './shared/hooks/useFacetMap';
import useNonRolledOutFacets from './shared/hooks/useNonRolledOutFacets';

const AppProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [isPluginEnabled, setIsPluginEnabled] = isDevelopment() ? useState(true) : useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [loadingSideBar, setLoadingSideBar] = isDevelopment() ? useState(false) : useState(true);
  const [isDomainWhitelisted, setIsDomainWhitelisted] = isDevelopment() ? useState(true) : useState(false);
  const [computedFacetMap, setComputedFacetMap] = useState({});

  const [isAlreadyIntegrated, setIsAlreadyIntegrated] = useState(scriptHasAlreadyBeenInjected());
  const [addedFacets, setAddedFacets] = useState(['Default-Facet']);
  const [canDeleteElement, setCanDeleteElement] = useState(false);
  const [disabledFacets, setDisabledFacets] = useState([]);
  const [textToCopy, setTextToCopy] = useState(`<script src="${APIUrl.apiBaseURL}/js?id={ID}"></script>`);

  const [expanded, setExpanded] = useState([]);
  const [facetMap, setFacetMap] = useFacetMap();
  const [authObject, setAuthObject] = useState({ email: '', password: '' });
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [facetLabelMenu, setFacetMenuLabel] = useState(null);
  const [selectedFacet, setSelectedFacet] = useSelectedFacet();
  const [nonRolledOutFacets, setNonRolledOutFacets] = useNonRolledOutFacets();

  const [loggedInUser, setLoggedInUser] = useState({});
  const [url, setUrl] = useState('');
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [workspaceId, setWorkspaceId] = useState(undefined);
  const [jwt, setJwt] = useState('');
  const [loading, setLoading] = useState(true);
  const [currAuthState, setCurrAuthState] = useState(authStateConstant.signingIn);
  const [globalFacets, setGlobalFacets] = useState([]);
  const [jsUrl, setJSUrl] = useState('');

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
      const parsedPath = parsePath(path, false);
      const element = $(path)[0];
      element.style.setProperty('opacity', 'unset');
    } catch (e) {
      console.log('[ERROR] onDeleteElement', e);
    }
  };

  const onDeleteFacet = (facetName) => {
    const facetValue = facetMap.get(facetName);
    facetValue && facetValue.forEach((domElement) => {
      onDeleteDOMElement(domElement.path);
    });

    facetMap.delete(facetName);
    setFacetMap(new Map(facetMap));
    const keys = [...facetMap.keys()];

    const newGlobalFacets = globalFacets.filter(e => e !== facetName);
    setGlobalFacets(newGlobalFacets);

    // base cases if no facets are present
    if (keys.length > 0) {
      setSelectedFacet();
      setExpanded([keys[keys.length - 1]]);
    } else {
      setSelectedFacet(defaultFacetName);
      setExpanded([defaultFacetName]);
      setGlobalFacets([defaultFacetName]);
      setNonRolledOutFacets([defaultFacetName]);
    }
  };

  const onGlobalCheckboxClick = (selectedFacet) => {
    if (globalFacets?.includes(selectedFacet)) {
      setGlobalFacets(globalFacets?.filter(e => e !== selectedFacet));
      enqueueSnackbar({
        message: `${selectedFacet} set to non-global`,
        variant: snackbar.success.text
      });
    } else {
      setGlobalFacets([...globalFacets, selectedFacet]);
      enqueueSnackbar({
        message: `${selectedFacet} set to global`,
        variant: snackbar.success.text
      });
    }
  }

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

  const loadJWT = async () => {
    const jwt = await AmplifyService.getCurrentUserJTW();
    if (jwt) {
      setJwt(jwt);
    }
  }

  const signInExistingUser = async () => {
    try {
      const username = await getKeyFromLocalStorage(storage.username);
      const password = await getKeyFromLocalStorage(storage.password);
      await Auth.signIn(username, password);
      setCurrAuthState(authStateConstant.signedIn);
    } catch (e) {
      console.log('[ERROR][signInExistingUser]', e);
      setCurrAuthState(authStateConstant.signingIn);
      setLoading(false);
    }
  }

  const loadCopySnippet = async () => {
    try {
      const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
      const domainRes = await getOrPostDomain(workspaceId);
      const text = `<script src="${APIUrl.apiBaseURL}/js?id=${domainRes.response.id}"></script>`;
      setTextToCopy(text);
    } catch (e) {
      console.log('[ERROR][loadCopySnippet]', e);
    }
  };

  const getJSUrl = async () => {
    const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
    const domainRes = await getOrPostDomain(workspaceId);
    const result = `${APIUrl.apiBaseURL}/js?id=${domainRes.response.id}`;
    setJSUrl(result);
    return result;
  }

  const getComputedFacetMap = async (jsUrl) => {
    try {
      const domainId = jsUrl.split('=')[1];
      const url = `${APIUrl.apiBaseURL}/js/facetmap?id=${domainId}`;
      const res = await fetch(url);
      const result = await res.json();
      
      await chrome.runtime.sendMessage({
        data: ChromeRequestType.SET_COOKIE_VALUE,
        config: {
          url: window.location.origin,
          name: 'FACET_MAP_PREVIEW',
          value: JSON.stringify(result)
        }
      });

      setComputedFacetMap(result);
      return result;
    } catch (e) {
      return undefined;
    }

  }

  useEffect(() => {
    async function loadDomainWhitelistedState() {
      const isDomainWhitelisted = await hasWhitelistedDomain(window.location.hostname);
      setIsDomainWhitelisted(isDomainWhitelisted);
      const isPluginEnabledValue = await getKeyFromLocalStorage(isPluginEnabledConstant);
      if (isPluginEnabledValue && isDomainWhitelisted) {
        setIsPluginEnabled(true);
        performDOMTransformation();
      }
    }
    loadDomainWhitelistedState();
  }, [])

  useEffect(() => {
    nonRolledOutFacets.forEach(facetName => {
      const facetArr = facetMap.get(facetName);
      facetArr?.forEach(element => {
        if (isSelectorValid(element.path)) {
          const domElement = document.querySelector(element.path);
          if (domElement) {
            domElement.style.setProperty('opacity', '0.3');
          }
        }
      })
    });
  }, [nonRolledOutFacets]);

  useEffect(async () => {
    loadJWT();
    signInExistingUser();
    loadLocalStorage(setIsPluginEnabled, setIsUserAuthenticated, setWorkspaceId);
    loadCopySnippet();
    getJSUrl();
  }, [setJwt]);

  // TODO Need to initialize main state of the application (domain, workspace et.al)
  useEffect(() => {
    (async () => {
      // not loading facetizer for extension-related pages
      if (window.location.hostname === appId) {
        return;
      }
      const isPluginEnabledVal = await getKeyFromLocalStorage(storage.isPluginEnabled);
      // dirty quick fix
      const isAuthenticationDOM = document.getElementById(domIds.authentication);
      const isPopup = document.getElementById(domIds.popup);
      if (!isPluginEnabledVal || isAuthenticationDOM || isPopup) {
        return;
      }
      const storageEmail = await getKeyFromLocalStorage(storage.username);
      const workspaceResponse = await getOrCreateWorkspace(storageEmail, false);
      const ff = await getJSUrl();
      getComputedFacetMap(ff);

      const workspaceId = workspaceResponse?.response?.workspaceId;
      const domainResponse = await getOrPostDomain(workspaceId);
      const domainId = domainResponse?.response?.id;
      await initSessionData({ workspaceId, domainId });
      const getFacetRequest = await getFacet(domainId);
      loadCopySnippet();
      if (getFacetRequest.status === 200) {
        const fMap = convertGetFacetResponseToMap(getFacetRequest.response);
        const globalFacetsArr = getGlobalArrayFromFacetResponse(getFacetRequest.response);
        setGlobalFacets(globalFacetsArr);
        if (fMap.size > 0) {
          setSelectedFacet(fMap.entries().next().value[0]);
        }
        setFacetMap(new Map(fMap));
        const hasDomainBeenWhitelisted = await hasWhitelistedDomain(window.location.hostname);
        setIsDomainWhitelisted(hasDomainBeenWhitelisted);
        if (hasDomainBeenWhitelisted) {
          loadInitialStateInDOM(fMap, setNonRolledOutFacets);
        }
      } else {
        setFacetMap(new Map([[defaultFacetName, []]]));
        setSelectedFacet(defaultFacetName);
        setExpanded([defaultFacetName]);
        setGlobalFacets([defaultFacetName]);
        setNonRolledOutFacets([defaultFacetName]);
      }
      setLoadingSideBar(false);
    })();
  }, []);

  const onSaveClick = async () => {
    try {
      await saveFacets(facetMap, nonRolledOutFacets, enqueueSnackbar, globalFacets);
      await getComputedFacetMap(jsUrl);
      enqueueSnackbar({
        message: `Configuration saved.`,
        variant: "success"
      });
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
        domainId: domainRes.response.id
      };

      for (let [facet, _] of facetMap) {
        onDeleteFacet(facet);
      }

      await triggerApiCall(HTTPMethods.DELETE, '/facet', body);
      await getComputedFacetMap(jsUrl);

      enqueueSnackbar({
        message: 'Facets reset.',
        variant: snackbar.success.text
      });
    } catch (e) {
      console.log('[ERROR]', e);
    }
  };

  const onFacetAdd = (label) => {
    if (addedFacets.includes(label)) {
      enqueueSnackbar({
        message: 'Please choose a unique name for your Facet.',
        variant: snackbar.error.text
      });
      return;
    }
    setAddedFacets([label, ...addedFacets]);
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
    window.location.reload();
  };

  const addFacet = (autoNumber = facetMap.size + 1) => {
    const newName = `Facet-${autoNumber}`;
    if (facetMap.get(newName)) {
      addFacet(autoNumber + 1);
      return;
    }
    setNonRolledOutFacets([...nonRolledOutFacets, newName]);
    setFacetMap(facetMap.set(newName, []));
    setSelectedFacet(newName);
    setGlobalFacets([...globalFacets, newName]);
    setExpanded([newName]);
  };

  window.enqueueSnackbar = enqueueSnackbar;
  return (
    <AppContext.Provider value={{
      onFacetAdd,
      addedFacets,
      setAddedFacets,
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
      isDomainWhitelisted,
      setIsDomainWhitelisted,
      globalFacets,
      setGlobalFacets,
      onGlobalCheckboxClick,
      jsUrl,
      isAlreadyIntegrated,
      setIsAlreadyIntegrated,
      computedFacetMap,
      setComputedFacetMap,
      getComputedFacetMap,

      loggedInUser, setLoggedInUser, url, setUrl, login, isUserAuthenticated, setIsUserAuthenticated,
      workspaceId, email, setEmail, loading, setLoading,
      currAuthState, setCurrAuthState, jwt, setJwt, nonRolledOutFacets, setNonRolledOutFacets
    }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
