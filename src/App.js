/*global chrome*/
import React, { useContext, useEffect, useCallback } from 'react';
import './App.css';
import FacetToolbar from './FacetToolbar';
import AppContext from './AppContext';
import { updateEvents } from './highlighter';

function App() {

  const { showSideBar, shouldDisplayFacetizer, setShouldDisplayFacetizer } = useContext(AppContext);

  chrome && chrome.runtime.onMessage && chrome.runtime.onMessage.addListener(
    function (request, sendResponse) {
      setShouldDisplayFacetizer(request.showFacetizer);
    });

  const handleUserKeyPress = useCallback(event => {
    if (event.ctrlKey) {
      setShouldDisplayFacetizer(!shouldDisplayFacetizer);
      const facetKey = 'facet-settings';
      chrome.storage && chrome.storage.sync.set({
        [facetKey]: {
          enabled: !shouldDisplayFacetizer
        }
      }, function () {
        console.log('updating local storage');
      });
    }
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