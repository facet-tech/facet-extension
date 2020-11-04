import React, { useState } from 'react';
import CoreContext from './CoreContext';

export default ({ children }) => {
    const [showFacetizer, setShowFacetizer] = useState(false);
    const [hiddenPaths, setHiddenPaths] = useState([]);
    const proxy = new Proxy(window.hiddenPaths, setHiddenPaths())

    return <CoreContext.Provider value={{ showFacetizer, setShowFacetizer }}>
        {children}
    </CoreContext.Provider>
}