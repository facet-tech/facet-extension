import React, { useState } from 'react';
import CoreContext from './CoreContext';

export default ({ children }) => {
    const [showFacetizer, setShowFacetizer] = useState(false);

    return <CoreContext.Provider value={{ showFacetizer, setShowFacetizer }}>
        {children}
    </CoreContext.Provider>
}