import React, { useContext, useEffect, useCallback } from 'react';
import './App.css';
import FacetButton from './FacetButton';
import AppContext from './AppContext';
import { updateEvents, pushDownFixedElement } from './highlighter';

function App() {
  const { showSideBar, shouldDisplayFacetizer, setShouldDisplayFacetizer } = useContext(AppContext);
  // TODO improve later on
  // function keyDownTextField(e) {
  //   if (e.ctrlKey) {
  //     // alert("You hit the control key.");
  //     console.log('alternating...', shouldDisplayFacetizer);
  //     setShouldDisplayFacetizer(!shouldDisplayFacetizer);
  //   }
  // }
  // useEffect(() => {
  //   document.addEventListener("keydown", keyDownTextField, false);
  // }, []);

  // TODO https://stackoverflow.com/a/55566585/1373465
  const handleUserKeyPress = useCallback(event => {
    if (event.ctrlKey) {
      setShouldDisplayFacetizer(!shouldDisplayFacetizer);
      // setUserText(prevUserText => `${prevUserText}${key}`);
    }
  }, []);

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
      {shouldDisplayFacetizer ? <FacetButton /> : null}
    </div >
  );
}

export default App;