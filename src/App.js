import React, { Component, useContext } from 'react';
import './App.css';
import NestedGrid from './NestedGrid';
import FacetButton from './FacetButton';
import AppContext from './AppContext';
import { updateEvents } from './highlighter';

function App() {
  const { showSideBar, isEnabled } = useContext(AppContext);
  // updateEvents();
  if (showSideBar) {
    updateEvents(true);
  } else {
    updateEvents();
  }

  return (
    true ?
      <div>
        <FacetButton></FacetButton>
        {/* {showSideBar ? <NestedGrid /> : <FacetButton />} */}
      </div > : null
  );
}

export default App;