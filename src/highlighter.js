import $ from 'jquery';
import { getKeyFromLocalStorage } from './shared/loadLocalStorage';
import { getFacet, getOrPostDomain } from './services/facetApiService';
import parsePath from './shared/parsePath';
import { api } from './shared/constant';
import get from 'lodash/get';
import { getElementNameFromPath } from './shared/parsePath';

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

const convertToDomElementObject = (path) => {
    return {
        name: getElementNameFromPath(path),
        path: path
    }
}

//TODO DEL?
const findFacetNameByDOMElementPath = (facetMap, domElementPath) => {
    let facetArray = Array.from(facetMap, ([name, value]) => ({ name, value }));
    const foundElement = facetArray.find(e => {
        const wantedValue = e.value.find(subE => {
            return subE.path === domElementPath
        })
        return wantedValue;
    })
    return foundElement.name;
}

const extractAllDomElementPathsFromFacetMap = (facetMap) => {
    let facetArray = Array.from(facetMap, ([name, value]) => ({ name, value }));
    if (facetArray.length === 0) {
        return []
    }
    return facetArray.map(facet => facet.value.map(domElement => domElement.path)).flat();
}

const removeDomPath = (facetMap, domPath, setFacetMap, selectedFacet) => {
    facetMap.forEach((facet, key) => {
        var newFacetArr = facet.filter(e => e.path !== domPath);
        if (facet.length !== newFacetArr.length) {
            if (key !== selectedFacet) {
                enqueueSnackbar(`This element was part of a different facet.`, { variant: "info" });
            }
            setFacetMap(new Map(facetMap.set(key, newFacetArr)));
            return;
        }
    });
}

/**
 * DOM Event Listener of Facet selection
 */
const onMouseClickHandle = function (event) {
    const selectedFacet = event.currentTarget.selectedFacet;
    const setFacetMap = event.currentTarget.setFacetMap;
    const facetMap = event.currentTarget.facetMap;
    const domPath = getDomPath(event.target);
    const allPaths = extractAllDomElementPathsFromFacetMap(facetMap);
    if (allPaths.includes(domPath)) {
        // remove element
        removeDomPath(facetMap, domPath, setFacetMap, selectedFacet);
        event.target.style.setProperty("opacity", "unset");
    } else {
        // add element
        let facet = facetMap.get(selectedFacet);
        const domElementObj = convertToDomElementObject(domPath);
        facet.push(domElementObj)
        setFacetMap(new Map(facetMap.set(selectedFacet, facet)));
        event.target.style.setProperty("opacity", "0.3", "important");
    }
    event.preventDefault();
    event.stopPropagation();
}

function getDomPath(el) {
    var stack = [];
    while (el.parentNode != null) {
        var sibCount = 0;
        var sibIndex = 0;
        for (var i = 0; i < el.parentNode.childNodes.length; i++) {
            var sib = el.parentNode.childNodes[i];
            if (sib.nodeName == el.nodeName) {
                if (sib === el) {
                    sibIndex = sibCount;
                }
                sibCount++;
            }
        }
        if (el.hasAttribute('id') && el.id != '') {
            stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
        } else if (sibCount > 1) {
            stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
        } else {
            stack.unshift(el.nodeName.toLowerCase());
        }
        el = el.parentNode;
    }
    var res = stack.slice(1).join(' > '); // removes the html element
    var withoutSpaces = res.replace(/ /g, "");
    return withoutSpaces;
}

const computeWithOrWithoutFacetizer = (strPath, facetizerIsPresent = true) => {
    var splitStr = strPath.split('>');
    var secondPathSplit = splitStr[1].split(':eq');
    if (secondPathSplit.length < 2 || !secondPathSplit[0].includes('div')) {
        return splitStr[1];
    }
    var regExp = /\(([^)]+)\)/;
    var matches = regExp.exec(secondPathSplit[1]);
    const currNumber = parseInt(matches[1]);
    const wantedNumber = facetizerIsPresent ? currNumber - 1 : currNumber + 1;
    const result = `${secondPathSplit[0]}:eq(${wantedNumber})`;
    return result;
}

// TODO refactor
// must refactor -> a lot of stuff in here...
// this function should only register/unregister callbacks, ideally it shouldn't handle any req
/**
 * 
 * @param {*} addEventsFlag Determines whether events will be added or removed from the DOM
 * @param {*} selectedFacet Currently selected facet
 * @param {*} facetMap Map of facets
 * @param {*} enqueueSnackbar notification context
 */
const updateEvents = async (addEventsFlag, selectedFacet, facetMap, setFacetMap, eSBar) => {
    try {
        // 1 time instantiation of singletons
        // kinda ugly, define a loader function her
        if (!workspaceId) {
            let getDomainRes = await getOrPostDomain(workspaceId);
            domainId = getDomainRes.response.id;
            workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
            getFacetResponse = await getFacet(domainId, window.location.pathname);
            const properFacetArr = parsePath(get(getFacetResponse, 'response.domElement[0].path'), false);
            properFacetArr && properFacetArr.forEach(ff => {
                $(ff).css("opacity", "0.3", "important");
            });
            enqueueSnackbar = eSBar;
        }

        [...document.querySelectorAll('* > :not(#facetizer) * > :not(#popup) *')]
            .filter(e => ![...document.querySelectorAll("#facetizer *, #popup *")]
                .includes(e)).forEach(e => {
                    // attaching these parameters into the event
                    e.selectedFacet = selectedFacet;
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

export { updateEvents, computeWithOrWithoutFacetizer, onMouseEnterHandle };