/*global chrome*/
import React, { useContext, useEffect } from 'react';
import './App.css';
import FacetToolbar from './FacetToolbar';
import AppContext from './AppContext';
import { updateEvents } from './highlighter';
import { getKeyFromLocalStorage } from './shared/loadLocalStorage';
import { isPluginEnabled as isPluginEnabledConstant } from './shared/constant';
import { useSnackbar } from 'notistack';
import $ from 'jquery';
import isDevelopment from './utils/isDevelopment';

function App() {
  const { enqueueSnackbar } = useSnackbar();
  const { showSideBar, isPluginEnabled, setIsPluginEnabled, isDomainWhitelisted, facetMap, setFacetMap, setLoadingSideBar, setNonRolledOutFacets } = useContext(AppContext);

  // TODO potential need of refactor
  chrome && chrome.runtime.onMessage && chrome.runtime.onMessage.addListener(
    async function (message, sendResponse) {
      await getKeyFromLocalStorage(isPluginEnabledConstant);
      window.location.reload();
    });

  useEffect(() => {
    if (!isPluginEnabled) {
      return;
    }
    // TODO Show big screen loader here...

    async function load() {
      if (!isPluginEnabled || !isDomainWhitelisted) {
        return;
      }
      if (showSideBar) {
        await updateEvents(true, facetMap, setFacetMap, enqueueSnackbar, setNonRolledOutFacets);
      } else {
        await updateEvents(false, facetMap, setFacetMap, enqueueSnackbar, setNonRolledOutFacets);
      }
      setLoadingSideBar(false);
    }

    load();


  }, [setIsPluginEnabled, isDomainWhitelisted, isPluginEnabled, showSideBar]);

  // removing width/height hack
  if ((isPluginEnabled && isDomainWhitelisted) || isDevelopment()) {
    $("#facet-sidebar").css("width", '300px');
    $("#facetizer").css("width", "300px");
  } else {
    $("#facet-sidebar").css("width", "0");
    $("#facetizer").css("width", "0");
  }

  return (
    <div style={{ height: '100%' }}>
      {(isPluginEnabled && isDomainWhitelisted) || isDevelopment() ? <FacetToolbar /> : null}
    </div >
  );
}

export default App;