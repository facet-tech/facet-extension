/*global chrome*/
import React, { useContext, useEffect } from 'react';
import './App.css';
import FacetToolbar from './FacetToolbar';
import AppContext from './AppContext';
import { performDOMTransformation, updateEvents } from './highlighter';
import { getKeyFromLocalStorage, } from './shared/loadLocalStorage';
import { isPluginEnabled as isPluginEnabledConstant } from './shared/constant';
import { useSnackbar } from 'notistack';

function App() {
  const { enqueueSnackbar } = useSnackbar();

  const { showSideBar, isPluginEnabled, setIsPluginEnabled, selectedFacet, facetMap, setFacetMap } = useContext(AppContext);

  chrome && chrome.runtime.onMessage && chrome.runtime.onMessage.addListener(
    async function (request, sendResponse) {
      const isPluginEnabledValue = await getKeyFromLocalStorage(isPluginEnabledConstant);
      setIsPluginEnabled(isPluginEnabledValue);
    });

  useEffect(async () => {
    const isPluginEnabledValue = await getKeyFromLocalStorage(isPluginEnabledConstant);
    if (isPluginEnabledValue) {
      setIsPluginEnabled(true);
      performDOMTransformation();
    }
  }, []);

  if (isPluginEnabled) {
    if (showSideBar) {
      updateEvents(true, selectedFacet, facetMap, setFacetMap, enqueueSnackbar);
    } else {
      updateEvents(false, selectedFacet, facetMap, setFacetMap, enqueueSnackbar);
    }
  }

  return (
    <div>
      {isPluginEnabled ? <div>
        <FacetToolbar />
      </div> : null}
    </div >
  );
}

export default App;