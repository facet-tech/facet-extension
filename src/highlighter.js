import $ from 'jquery';
import { getKeyFromLocalStorage } from './shared/loadLocalStorage';
import { getFacet, getOrPostDomain } from './services/facetApiService';
import parsePath from './shared/parsePath';
import { api, snackbar, styles } from './shared/constant';
import get from 'lodash/get';
import { getElementNameFromPath } from './shared/parsePath';
import isDevelopment from './utils/isDevelopment';

/**
 * Performs transformation on client's DOM
 */
const performDOMTransformation = () => {
    // push the body
    $('body').attr('style', function (i, s) {
        return (s || '') + `position: absolute !important;left: ${styles.drawerWidth}px !important;right: 0px !important;min-height: calc(100% - 96px) !important;overflow-x: initial !important;`;
    });

    if (isDevelopment()) {
        return
    }
    $('*') && $('*').filter(function () {
        return $(this).css('position') === 'fixed' && this.id !== 'facetizer' &&
            this.className !== 'MuiPaper-root MuiDrawer-paper jss8 MuiDrawer-paperAnchorLeft MuiDrawer-paperAnchorDockedLeft MuiPaper-elevation0';
    }).each(function () {
        $(this).css('position', 'absolute', 'important');
        $(this).css('left', `${styles.drawerWidth}px`, 'important');
    })
}

// TODO repetitive task; consider abstraction
let selectedFacet;
const setSelectedFacetHighlighter = (value) => {
    selectedFacet = value;
}
const getSelectedFacet = () => {
    return selectedFacet;
}

let facetMap;
let getFacetMap = (value) => {
    return facetMap;
}
let setFacetMapHighlighter = (value) => {
    facetMap = value;

}

let nonRolledOutFacetsHighlighter = [];
let setNonRolledOutFacetsHighlighter = (value) => {
    updatedDOMNonRolledOutFacets(nonRolledOutFacetsHighlighter, value);
    nonRolledOutFacetsHighlighter = value;
}

const updatedDOMNonRolledOutFacets = (prevVal, afterVal) => {

    // newly added values
    afterVal.filter(e => !prevVal.includes(e)).forEach(val => {
        const facetMap = getFacetMap();
        const pathArr = facetMap.get(val);
        pathArr?.forEach(element => {
            $(element.path).css("opacity", "0.3", "important");
        });
    });

    // removed values
    prevVal.filter(e => !afterVal.includes(e)).forEach(val => {
        const facetMap = getFacetMap();
        const pathArr = facetMap.get(val);
        pathArr?.forEach(element => {
            $(element.path).css("opacity", "unset");
        });
    });

}

// facetMap & setFacetMap
// singletons
let domainId;
let workspaceId;
let getFacetResponse;
let enqueueSnackbar;

const onMouseEnterHandle = function (event) {
    event.target.style.setProperty("outline", "5px ridge #c25d29");
    event.target.style.setProperty("cursor", "pointer");
};

/**
 * @param {selectedFacet} selected facet
 * @param {setFacetMap} lifecycle event
 */
const onMouseLeaveHandle = function (event) {
    event.target.style.setProperty("outline", "unset");
    event.target.style.setProperty("cursor", "unset");
}

/**
 * 
 * Recursively iterates on existing domElements, and assigns the correct incremental suffix to the domElement
 * 
 * @param {*} elementName 
 * @param {*} facet 
 * @param {*} currNumber 
 */
const getIncreasedElementNameNumber = (elementName, facet, currNumber = 1) => {
    const nameArr = elementName.split('-');
    if (nameArr.length === 1) {
        const result = `${elementName}-${currNumber}`;
        if (facet.filter(e => e.name === result).length > 0) {
            return getIncreasedElementNameNumber(result, facet, currNumber + 1);
        } else {
            return result;
        }
    }
    const lastNumber = parseInt(nameArr[nameArr.length - 1]) + 1;
    let concatenatedName = '';
    for (let i = 0; i < nameArr.length - 1; i++) {
        concatenatedName += nameArr[i];
    }
    const finalResult = `${concatenatedName}-${lastNumber}`;
    if (facet.filter(e => e.name === finalResult).length > 0) {
        return getIncreasedElementNameNumber(finalResult, facet, currNumber + 1);
    }
    return finalResult;
}

const convertToDomElementObject = (path, facet) => {
    const name = getElementNameFromPath(path, facet);
    // if (facet.filter(e => e.name === name).length > 0) {
    //     name = getIncreasedElementNameNumber(name, facet);
    // }
    return {
        name,
        path: path
    }
}

const extractAllDomElementPathsFromFacetMap = (facetMap) => {
    let facetArray = Array.from(facetMap, ([name, value]) => ({ name, value }));
    if (facetArray.length === 0) {
        return []
    }
    return facetArray.map(facet => facet.value.map(domElement => domElement.path)).flat();
}

const removeDomPath = (facetMap, domPath, setFacetMap, selectedFacet) => {
    facetMap && facetMap.forEach((facet, key) => {
        var newFacetArr = facet.filter(e => e.path !== domPath);
        if (facet.length !== newFacetArr.length) {
            if (key !== selectedFacet) {
                enqueueSnackbar({
                    message: `Element was moved from the "${key}" facet.`,
                    variant: snackbar.info.text
                });
            }
            setFacetMap(new Map(facetMap.set(key, newFacetArr)));
            return;
        }
    });
}

/**
 *  @param {*} facetMap
 *  @param {*} setNonRolledOutFacets
 */
const loadInitialStateInDOM = (facetMap, setNonRolledOutFacets) => {
    let nonRolledOutFacets = [];
    const facetArray = Array.from(facetMap, ([name, value]) => ({ name, value }));
    facetArray && facetArray.forEach(facet => {
        const value = facet.value;
        if (value.enabled) {
            nonRolledOutFacets.push(facet.name);
        }

        value.forEach(val => {
            if (!val.enabled) {
                return;
            }
            const path = parsePath([val.path], true);
            $(path[0]).css("opacity", "0.3", "important");
            $(val.path).css("opacity", "0.3", "important");
        })
    });
    setNonRolledOutFacets(nonRolledOutFacets);
}

/**
 * DOM Event Listener of Facet selection
 */
const onMouseClickHandle = function (event) {
    const selectedFacet = getSelectedFacet();
    const facetMap = getFacetMap();
    const setFacetMap = event.currentTarget.setFacetMap;
    let selectedFacetName = facetMap.get(selectedFacet) || [];
    const domPath = getDomPath(event.target);
    console.log(domPath);
    const allPaths = extractAllDomElementPathsFromFacetMap(facetMap);
    if (allPaths.includes(domPath)) {
        removeDomPath(facetMap, domPath, setFacetMap, selectedFacet);
        event.target.style.setProperty("opacity", "unset");
    } else {
        const domElementObj = convertToDomElementObject(domPath, selectedFacetName);
        selectedFacetName.push(domElementObj);
        setFacetMap(new Map(facetMap.set(selectedFacet, selectedFacetName)));
        if (nonRolledOutFacetsHighlighter.includes(selectedFacet)) {
            event.target.style.setProperty("opacity", "0.3", "important");
        }
    }
    event.preventDefault();
    event.stopPropagation();
}

function getDomPath(el) {
    if (!el || !isElement(el)) {
        return '';
    }
    var stack = [];
    var isShadow = false;
    while (el.parentNode != null) {
        var sibCount = 0;
        var sibIndex = 0;
        for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
            var sib = el.parentNode.childNodes[i];
            if ( sib.nodeName == el.nodeName ) {
                if ( sib === el ) {
                    sibIndex = sibCount;
                }
                sibCount++;
            }
        }
        var nodeName = el.nodeName.toLowerCase();
        if (isShadow) {
            nodeName += "::shadow";
            isShadow = false;
        }
        if ( sibCount > 1 ) {
            if(sibIndex === 0) {
                stack.unshift(nodeName);
            } else {
                stack.unshift(nodeName + ':nth-of-type(' + (sibIndex + 1) + ')');
            }
        } else {
            stack.unshift(nodeName);
        }
        el = el.parentNode;
        if (el.nodeType === 11) {
            isShadow = true;
            el = el.host;
        }
    }
    var res = stack.slice(1).join(' > ');
    return res.replace(/ /g, "");
}

/**
 * Returns whether a given element in an HTML element or not
 *
 * @param element
 * @returns {boolean}
 */
function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;
}

/**
 * 
 * @param {*} addEventsFlag Determines whether events will be added or removed from the DOM
 * @param {*} facetMap Map of facets
 * @param {*} enqueueSnackbar notification context
 */
const updateEvents = async (addEventsFlag, facetMap, setFacetMap, eSBar) => {
    try {
        if (!workspaceId) {
            workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
            let getDomainRes = await getOrPostDomain(workspaceId);
            domainId = getDomainRes.response.id;
            getFacetResponse = await getFacet(domainId);
            const properFacetArr = parsePath(get(getFacetResponse, 'response.domElement[0].path'), false);
            properFacetArr && properFacetArr.forEach(ff => {
                $(ff).css("opacity", "0.3", "important");
            });
            enqueueSnackbar = eSBar;
        }

        [...document.querySelectorAll('* > :not(#facetizer) * > :not(#popup) *')]
            .filter(e => ![...document.querySelectorAll("#facetizer *, #popup *, #facet-menu *")]
                .includes(e)).forEach(e => {
                    // attaching these parameters into the event
                    e.facetMap = facetMap;
                    e.setFacetMap = setFacetMap;
                    e.enqueueSnackbar = enqueueSnackbar;
                    if (addEventsFlag) {
                        e.addEventListener("click", onMouseClickHandle, false);
                        e.addEventListener("mouseenter", onMouseEnterHandle, false);
                        e.addEventListener("mouseleave", onMouseLeaveHandle, false);
                    } else {
                        e.removeEventListener("click", onMouseClickHandle, false);
                        e.removeEventListener("mouseenter", onMouseEnterHandle, false);
                        e.removeEventListener("mouseleave", onMouseLeaveHandle, false);
                        e.style.cursor = "cursor";
                    }
                });
    } catch (e) {
        console.log(`[ERROR] [updateEvents] `, e);
    }
}

export {
    updateEvents, onMouseEnterHandle, loadInitialStateInDOM,
    performDOMTransformation, setSelectedFacetHighlighter,
    setFacetMapHighlighter, setNonRolledOutFacetsHighlighter
};