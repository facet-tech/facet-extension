import React, { useState } from 'react';
import PopupContext from './PopupContext';

export default ({ children }) => {

    // email,id:  
    const [loggedInUser, setLoggedInUser] = useState({});
    const [shouldDisplayFacetizer, setShouldDisplayFacetizer] = useState(true);
    return <PopupContext.Provider value={{ loggedInUser, setLoggedInUser, shouldDisplayFacetizer, setShouldDisplayFacetizer }}>
        {children}
    </PopupContext.Provider>
}