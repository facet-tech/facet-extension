/*global chrome*/
import React, { useContext, useEffect, useCallback, useState } from 'react';
import './App.css';
import FacetToolbar from './FacetToolbar';
import AppContext from './AppContext';
import { updateEvents } from './highlighter';

function App() {

  const { showSideBar, shouldDisplayFacetizer, setShouldDisplayFacetizer, showToolbox } = useContext(AppContext);

  chrome.runtime.onMessage.addListener(
    function (request, sendResponse) {
      console.log('RECIEVED', shouldDisplayFacetizer)
      setShouldDisplayFacetizer(request.showFacetizer);
    });

  const handleUserKeyPress = useCallback(event => {
    if (event.ctrlKey) {
      setShouldDisplayFacetizer(!shouldDisplayFacetizer);
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