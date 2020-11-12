/*global chrome*/
import React, { useContext, useEffect, useCallback } from 'react';
import './App.css';
import FacetToolbar from './FacetToolbar';
import AppContext from './AppContext';
import { updateEvents } from './highlighter';
import { getKeyFromLocalStorage, setKeyInLocalStorage } from './shared/loadLocalStorage';
import { showFacetizer as showFacetizerConstant, isPluginEnabled as isPluginEnabledConstant } from './shared/constant';

function App() {

  const { showSideBar, shouldDisplayFacetizer, setShouldDisplayFacetizer,
    isPluginEnabled, setIsPluginEnabled, hiddenPathsArr, setHiddenPathsArr,
    selectedFacet, facetMap } = useContext(AppContext);

  chrome && chrome.runtime.onMessage && chrome.runtime.onMessage.addListener(
    async function (request, sendResponse) {
      const showFacetizerValue = await getKeyFromLocalStorage(showFacetizerConstant);
      const isPluginEnabledValue = await getKeyFromLocalStorage(isPluginEnabledConstant);
      setShouldDisplayFacetizer(showFacetizerValue);
      setIsPluginEnabled(isPluginEnabledValue);
    });

  const handleUserKeyPress = useCallback(event => {
    if (event.ctrlKey && event.keyCode === 69) {
      setKeyInLocalStorage(showFacetizerConstant, !shouldDisplayFacetizer);
      setShouldDisplayFacetizer(!shouldDisplayFacetizer);
    };
  }, [shouldDisplayFacetizer, setShouldDisplayFacetizer]);

  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress);
    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [handleUserKeyPress, shouldDisplayFacetizer]);

  if (isPluginEnabled) {
    if (showSideBar) {
      updateEvents(true, [setHiddenPathsArr], hiddenPathsArr, selectedFacet, facetMap);
    } else {
      updateEvents(false, [setHiddenPathsArr], hiddenPathsArr, selectedFacet, facetMap);
    }
  }

  return (
    <div>
      {isPluginEnabled && shouldDisplayFacetizer ? <div>
        <FacetToolbar />
      </div> : null}
    </div >
  );
}

export default App;