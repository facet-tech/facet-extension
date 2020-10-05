/*global chrome*/
import React, { useContext, useEffect, useCallback } from 'react';
import './App.css';
import FacetToolbar from './FacetToolbar';
import AppContext from './AppContext';
import { updateEvents } from './highlighter';
import { getKeyFromLocalStorage } from './shared/loadLocalStorage';
import loadLocalStorage from './shared/loadLocalStorage';
import { setKeyInLocalStorage } from './shared/loadLocalStorage';

function App() {

  const { showSideBar, shouldDisplayFacetizer, setShouldDisplayFacetizer,
    hasLoadedHighlighter, setHasLoadedHighlighter, isPluginEnabled, setIsPluginEnabled } = useContext(AppContext);

  chrome && chrome.runtime.onMessage && chrome.runtime.onMessage.addListener(
    async function (request, sendResponse) {

      const showFacetizerValue = await getKeyFromLocalStorage('showFacetizer');
      const isPluginEnabledValue = await getKeyFromLocalStorage('isPluginEnabled');
      setShouldDisplayFacetizer(showFacetizerValue);
      setIsPluginEnabled(isPluginEnabledValue);
    });

  const handleUserKeyPress = useCallback(event => {
    if (event.ctrlKey) {
      setKeyInLocalStorage('showFacetizer', !shouldDisplayFacetizer);
      setShouldDisplayFacetizer(!shouldDisplayFacetizer);
    };
  }, [shouldDisplayFacetizer, setShouldDisplayFacetizer]);

  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress);
    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [handleUserKeyPress, shouldDisplayFacetizer]);

  if (showSideBar) {
    updateEvents(true);
  } else {
    updateEvents();
  }

  return (
    <div>
      {shouldDisplayFacetizer ? <FacetToolbar /> : null}
    </div >
  );
}

export default App;