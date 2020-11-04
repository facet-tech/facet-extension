/*global chrome*/

import React, { useState, useEffect } from 'react';
import AppContext from './AppContext';
import { useSnackbar } from 'notistack';
import loadLocalStorage from './shared/loadLocalStorage';

const AppProvider = ({ children, hiddenElementsArray }) => {
    const { enqueueSnackbar } = useSnackbar();

    const [isEnabled, setIsEnabled] = useState(false);
    const [addedFacets, setAddedFacets] = useState(["Default-Facet"]);
    const [isAddingFacet, setIsAddingFacet] = useState(false);
    const [canDeleteElement, setCanDeleteElement] = useState(false);
    const [disabledFacets, setDisabledFacets] = useState([]);
    const [newlyAddedFacet, setNewlyAddedFacet] = useState("Default-Facet");
    const [addedElements, setAddedElements] = useState(new Map());
    const [isPluginEnabled, setIsPluginEnabled] = useState(true);
    const [shouldDisplayFacetizer, setShouldDisplayFacetizer] = useState(true);
    const [showSideBar, setShowSideBar] = useState(false);

    useEffect(async () => {
        await loadLocalStorage(setShouldDisplayFacetizer, setIsPluginEnabled);
    }, []);

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
        setShouldDisplayFacetizer, isPluginEnabled, setIsPluginEnabled
    }}>
        {children}
    </AppContext.Provider>
};

export default AppProvider;