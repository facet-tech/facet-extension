import React, { useState } from 'react';
import AppContext from './AppContext';
import { useSnackbar } from 'notistack';

const AppProvider = ({ children, hiddenElementsArray }) => {

    const { enqueueSnackbar } = useSnackbar();
    const [addedFacets, setAddedFacets] = useState(["Default-Facet"]);
    const [isAddingFacet, setIsAddingFacet] = useState(false);
    const [canDeleteElement, setCanDeleteElement] = useState(false);
    const [disabledFacets, setDisabledFacets] = useState([]);
    const [showSideBar, setShowSideBar] = useState(true);
    // const [shouldDisplay, setShouldDisplay] = useState(false);
    const [newlyAddedFacet, setNewlyAddedFacet] = useState("Default-Facet");
    // String "Key", Array Values
    // TODO depracate this to use addedFacets
    // SAFE to delete / replace bu addedFacets
    const [addedElements, setAddedElements] = useState(new Map());

    window.facetNinjaObject = {
        setAddedFacets
    };
    console.log('addedElements',addedElements, addedFacets);
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

    return <AppContext.Provider value={{
        hiddenElementsArray, onFacetAdd, addedFacets, setAddedFacets,
        isAddingFacet, setIsAddingFacet, newlyAddedFacet,
        setNewlyAddedFacet, addedElements, setAddedElements,
        canDeleteElement, setCanDeleteElement, disabledFacets,
        setDisabledFacets, showSideBar, setShowSideBar
    }}>
        {children}
    </AppContext.Provider>
};

export default AppProvider;