import React, { useContext } from 'react';
import './App.css';
import NestedGrid from './NestedGrid';
import FacetButton from './FacetButton';
import AppContext from './AppContext';
import { updateEvents } from './highlighter';
import styled from 'styled-components';

const StickyDiv = styled.div``

function App() {
  const { showSideBar, isEnabled } = useContext(AppContext);
  // updateEvents();
  if (showSideBar) {
    updateEvents(true);
  } else {
    updateEvents();
  }

  return (
    <StickyDiv>
      <FacetButton></FacetButton>
      {/* {showSideBar ? <NestedGrid /> : <FacetButton />} */}
    </StickyDiv >
  );
}

export default App;