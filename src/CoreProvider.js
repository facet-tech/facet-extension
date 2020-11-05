import React, { useState } from 'react';
import CoreContext from './CoreContext';

export default ({ children }) => {
    const [highlightedFacets, setHighlightedFacets] = useState([]);
    console.log('@coreprovider', highlightedFacets);
    return <CoreContext.Provider value={{ highlightedFacets, setHighlightedFacets }}>
        {children}
    </CoreContext.Provider>
}