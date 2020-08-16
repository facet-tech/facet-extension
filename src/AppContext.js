import React from 'react';

const AppContext = React.createContext({
    hiddenElementsArray: [],
    onFacetAdd: (e) => { },
});

export default AppContext;