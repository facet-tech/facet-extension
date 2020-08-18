import React, { Component, useContext } from 'react';
import './App.css';
import NestedGrid from './NestedGrid';
import FacetButton from './FacetButton';
import AppContext from './AppContext';

function App() {
  const { showSideBar } = useContext(AppContext);
  return (
    <div>
      <FacetButton></FacetButton>
      {showSideBar ? <NestedGrid /> : <FacetButton />}
    </div >
  );
}

export default App;