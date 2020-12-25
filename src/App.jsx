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

function App() {
  const { enqueueSnackbar } = useSnackbar();
  const { showSideBar, isPluginEnabled, setIsPluginEnabled,
    isDomainWhitelisted, facetMap, setFacetMap } = useContext(AppContext);
  // TODO potential need of refactor
  chrome && chrome.runtime.onMessage && chrome.runtime.onMessage.addListener(
    async function (message, sendResponse) {
      await getKeyFromLocalStorage(isPluginEnabledConstant);
      window.location.reload();
    });

  useEffect(() => {
    // loadLocalStorageValues();
    if (!isPluginEnabled) {
      return;
    }
    if (showSideBar) {
      updateEvents(true, facetMap, setFacetMap, enqueueSnackbar);
    } else {
      updateEvents(false, facetMap, setFacetMap, enqueueSnackbar);
    }
  }, [setIsPluginEnabled, isPluginEnabled, showSideBar]);

  // removing width/height hack
  if (!isPluginEnabled) {
    $("#facet-sidebar").css("width", "0");
    $("#facetizer").css("width", "0");
  } else {
    $("#facet-sidebar").css("width", '280px');
    $("#facetizer").css("width", "280px");
  }

  return (
    <div style={{ height: '100%' }}>
      {isPluginEnabled && isDomainWhitelisted ? <FacetToolbar /> : null}
    </div >
  );
}

export default App;