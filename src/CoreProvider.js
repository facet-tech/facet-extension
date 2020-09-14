import React, { useState } from 'react';
import CoreContext from './CoreContext';

export default ({ children }) => {
    // email,id:  
    const [showFacetizer, setShowFacetizer] = useState(false);
    return <CoreContext.Provider value={{ showFacetizer, setShowFacetizer }}>
        {children}
    </CoreContext.Provider>
}