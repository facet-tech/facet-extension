import React, { useState } from 'react';
import PopupContext from './PopupContext';

export default ({ children }) => {

    // email,id:  
    const [loggedInUser, setLoggedInUser] = useState({});
    return <PopupContext.Provider value={{ loggedInUser, setLoggedInUser }}>
        {children}
    </PopupContext.Provider>
}