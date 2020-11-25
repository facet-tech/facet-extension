/*global chrome*/
import React, { useContext, useEffect } from 'react';
import './App.css';
import FacetToolbar from './FacetToolbar';
import AppContext from './AppContext';
import { performDOMTransformation, updateEvents } from './highlighter';
import { getKeyFromLocalStorage } from './shared/loadLocalStorage';
import { isPluginEnabled as isPluginEnabledConstant } from './shared/constant';
import { useSnackbar } from 'notistack';

function App() {
  const { enqueueSnackbar } = useSnackbar();
  const { showSideBar, isPluginEnabled, setIsPluginEnabled, selectedFacet, facetMap, setFacetMap } = useContext(AppContext);

  chrome && chrome.runtime.onMessage && chrome.runtime.onMessage.addListener(
    async function (request, sendResponse) {
      await getKeyFromLocalStorage(isPluginEnabledConstant);
      window.location.reload();
    });

  const loadLocalStorageValues = async () => {
    const isPluginEnabledValue = await getKeyFromLocalStorage(isPluginEnabledConstant);
    if (isPluginEnabledValue) {
      setIsPluginEnabled(true);
      performDOMTransformation();
    }
  }

  useEffect(() => {
    loadLocalStorageValues();
  }, [setIsPluginEnabled]);

  if (isPluginEnabled) {
    if (showSideBar) {
      updateEvents(true, selectedFacet, facetMap, setFacetMap, enqueueSnackbar);
    } else {
      updateEvents(false, selectedFacet, facetMap, setFacetMap, enqueueSnackbar);
    }
  }
  console.log('!isPluginEnabled', isPluginEnabled)
  return (
    <div>
      {isPluginEnabled ? <div>
        <FacetToolbar />
      </div> : 'test'}
    </div >
  );
}

export default App;