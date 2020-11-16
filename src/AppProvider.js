/*global chrome*/

import React, { useState } from 'react';
import AppContext from './AppContext';
import { useSnackbar } from 'notistack';
import isDevelopment from './utils/isDevelopment';
import { getFacet, getDomain, convertGetFacetResponseToMap } from './services/facetApiService';
import { getKeyFromLocalStorage } from './shared/loadLocalStorage';
import { api, storage } from './shared/constant';
import get from 'lodash/get';
import useEffectAsync from './shared/hooks/useEffectAsync';
import { loadInitialState } from './highlighter';
import { getOrPostDomain, triggerApiCall, saveFacets } from './services/facetApiService';
import { HTTPMethods } from './shared/constant';

const AppProvider = ({ children }) => {

    const { enqueueSnackbar } = useSnackbar();

    // TODO these need to change during dev
    const [isPluginEnabled, setIsPluginEnabled] = isDevelopment() ? useState(true) : useState(false);
    const [isEnabled, setIsEnabled] = isDevelopment() ? useState(true) : useState(false);
    const [showSideBar, setShowSideBar] = isDevelopment() ? useState(true) : useState(false);

    const [addedFacets, setAddedFacets] = useState(["Default-Facet"]);
    const [canDeleteElement, setCanDeleteElement] = useState(false);
    const [disabledFacets, setDisabledFacets] = useState([]);
    const [newlyAddedFacet, setNewlyAddedFacet] = useState("Default-Facet");
    const [addedElements, setAddedElements] = useState(new Map());

    const [selectedFacet, setSelectedFacet] = useState('Facet-1');
    const [facetMap, setFacetMap] = useState(new Map([['Facet-1', []]]));
    const [loadingSideBar, setLoadingSideBar] = useState(true);

    const onSaveClick = async () => {
        try {
            await saveFacets(facetMap, enqueueSnackbar);
            if (!isDevelopment()) {
                window.location.reload();
            }
        } catch (e) {
            console.log(`[ERROR] [onSaveClick] `, e)
        }
    }

    const reset = async () => {
        try {
            const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
            let domainRes = await getOrPostDomain(workspaceId);

            const body = {
                domainId: domainRes.response.id,
                urlPath: window.location.pathname
            }
            enqueueSnackbar(`Facets reset.`, { variant: "success" });
            await triggerApiCall(HTTPMethods.DELETE, '/facet', body);
            if (!isDevelopment()) {
                window.location.reload();
            }
        } catch (e) {
            console.log('[ERROR]', e);
        }
    }

    useEffectAsync(async () => {
        const isPluginEnabled = await getKeyFromLocalStorage(storage.isPluginEnabled);
        if (!isPluginEnabled) {
            return
        }
        const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
        const domainResponse = await getDomain(window.location.hostname, workspaceId);
        const domainId = get(domainResponse, 'response.id');
        const getFacetRequest = await getFacet(domainId, window.location.pathname);
        if (getFacetRequest.status === 200) {
            const fMap = convertGetFacetResponseToMap(getFacetRequest.response);
            if (fMap.size > 0) {
                setSelectedFacet(fMap.entries().next().value[0]);
            }
            setFacetMap(new Map(fMap));
            loadInitialState(fMap);
        } else {
            setFacetMap(new Map([['Facet-1', []]]));
        }
        setLoadingSideBar(false);
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
    }

    const isElementHighlighted = (path) => {
        // TODO
    }

    // sharing stuff among content script
    window.addedElements = addedElements;
    window.setAddedElements = setAddedElements;
    window.enqueueSnackbar = enqueueSnackbar;
    return <AppContext.Provider value={{
        onFacetAdd, addedFacets, setAddedFacets,
        newlyAddedFacet, setNewlyAddedFacet, addedElements,
        setAddedElements, canDeleteElement, setCanDeleteElement,
        disabledFacets, setDisabledFacets, showSideBar, setShowSideBar,
        isEnabled, setIsEnabled, isPluginEnabled, setIsPluginEnabled,
        enqueueSnackbar, isElementHighlighted, facetMap, setFacetMap, selectedFacet,
        setSelectedFacet, loadingSideBar, setLoadingSideBar, onSaveClick, reset
    }}>
        {children}
    </AppContext.Provider>
};

export default AppProvider;