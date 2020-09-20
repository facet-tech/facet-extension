import React, { useState } from 'react';
import AppContext from './AppContext';
import { useSnackbar } from 'notistack';
 
const AppProvider = ({ children, hiddenElementsArray }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [shouldDisplayFacetizer, setShouldDisplayFacetizer] = useState(true);
    const [isEnabled, setIsEnabled] = useState(false);
    const [addedFacets, setAddedFacets] = useState(["Default-Facet"]);
    const [isAddingFacet, setIsAddingFacet] = useState(false);
    const [canDeleteElement, setCanDeleteElement] = useState(false);
    const [disabledFacets, setDisabledFacets] = useState([]);
    const [showSideBar, setShowSideBar] = useState(false);
    const [newlyAddedFacet, setNewlyAddedFacet] = useState("Default-Facet");
    // String "Key", Array Values
    // TODO depracate this to use addedFacets
    // SAFE to delete / replace bu addedFacets
    const [addedElements, setAddedElements] = useState(new Map());

    const onFacetAdd = (label) => {
        if (addedFacets.includes(label)) {
            enqueueSnackbar(`Please choose a unique name for your Facet.`, { variant: "error" });
            return;
        }
        setAddedFacets([label, ...addedFacets]);
        setNewlyAddedFacet(label);
        enqueueSnackbar(`Facet "${label}" was created!`, { variant: "success" });
        window.selectedDOM = 'main';
        setIsAddingFacet(false);
    }

    // sharing stuff among content script
    window.addedElements = addedElements;
    window.setAddedElements = setAddedElements;
    window.enqueueSnackbar = enqueueSnackbar;
    return <AppContext.Provider value={{
        hiddenElementsArray, onFacetAdd, addedFacets, setAddedFacets,
        isAddingFacet, setIsAddingFacet, newlyAddedFacet,
        setNewlyAddedFacet, addedElements, setAddedElements,
        canDeleteElement, setCanDeleteElement, disabledFacets,
        setDisabledFacets, showSideBar, setShowSideBar,
        isEnabled, setIsEnabled, shouldDisplayFacetizer,
        setShouldDisplayFacetizer
    }}>
        {children}
    </AppContext.Provider>
};

export default AppProvider;