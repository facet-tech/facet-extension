import React, { useContext } from 'react';
import './App.css';
import NestedGrid from './NestedGrid';
import FacetButton from './FacetButton';
import AppContext from './AppContext';
import { updateEvents } from './highlighter';
import styled from 'styled-components';
import MenuPopupState from './MenuPopupState';

function App() {
  const { showSideBar, isEnabled } = useContext(AppContext);
  // updateEvents();
  if (showSideBar) {
    updateEvents(true);
  } else {
    updateEvents();
  }

  return (
    <div>
      <FacetButton></FacetButton>
      {/* {showSideBar ? <NestedGrid /> : <FacetButton />} */}
    </div >
  );
}

export default App;