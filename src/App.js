/*global chrome*/
import React, { useContext, useEffect, useCallback } from 'react';
import './App.css';
import FacetToolbar from './FacetToolbar';
import AppContext from './AppContext';
import { updateEvents } from './highlighter';
import { getKeyFromLocalStorage, setKeyInLocalStorage } from './shared/loadLocalStorage';

function App() {

  const { showSideBar, shouldDisplayFacetizer, setShouldDisplayFacetizer,
    isPluginEnabled, setIsPluginEnabled } = useContext(AppContext);

  chrome && chrome.runtime.onMessage && chrome.runtime.onMessage.addListener(
    async function (request, sendResponse) {

      const showFacetizerValue = await getKeyFromLocalStorage('showFacetizer');
      const isPluginEnabledValue = await getKeyFromLocalStorage('isPluginEnabled');
      setShouldDisplayFacetizer(showFacetizerValue);
      setIsPluginEnabled(isPluginEnabledValue);
    });

  const handleUserKeyPress = useCallback(event => {
    if (event.ctrlKey && event.keyCode === 69) {
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

  if (isPluginEnabled) {
    if (showSideBar) {
      console.log('[LOADING REGISTER EVENTS] true', true)
      updateEvents(true);
    } else {
      console.log('[LOADING REGISTER EVENTS] false', false)
      updateEvents(false);
    }
  }


  return (
    <div>
      {isPluginEnabled && shouldDisplayFacetizer ? <FacetToolbar /> : null}
    </div >
  );
}

export default App;