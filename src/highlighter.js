import $ from 'jquery';
import { getKeyFromLocalStorage } from './shared/loadLocalStorage';
import { getFacet, getDomain, createDomain, getOrPostDomain } from './services/facetApiService';
import parsePath from './shared/parsePath';
import { api } from './shared/constant';
import get from 'lodash/get';
import CustomProxy from './utils/CustomProxy';
import { getElementNameFromPath } from './shared/parsePath';

// singletons
let hiddenPaths;
let domainId;
let workspaceId;
let getFacetResponse;

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

const onMouseClickHandle = function (event) {
    const selectedFacet = event.currentTarget.selectedFacet;
    const facetMap = event.currentTarget.facetMap;
    const res = getDomPath(event.target);
    const domElementsArr = facetMap.get(selectedFacet) !== undefined ? facetMap.get(selectedFacet) : [];
    if (hiddenPaths.includes(res)) {
        // new state management stuff
        const newDomElementsArr = domElementsArr.filter(e => e.path !== res);
        facetMap.set(selectedFacet, newDomElementsArr);
        hiddenPaths = hiddenPaths.filter(e => e !== res);
        event.target.style.setProperty("opacity", "unset");
    } else {
        const domElementObj = convertToDomElementObject(res);
        let arr = facetMap.get(selectedFacet);
        if (!arr) {
            arr = [];
            facetMap.set(selectedFacet, arr);
        }
        arr.push(domElementObj);
        event.target.style.setProperty("opacity", "0.3", "important");
        hiddenPaths.push(res);
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
const updateEvents = async (flag, observerFunctions, hiddenPathsArr, selectedFacet, facetMap) => {
    try {
        // 1 time instantiation of singletons
        let facetsArr = [];
        if (!hiddenPaths) {
            hiddenPaths = hiddenPathsArr;
            let getDomainRes = await getOrPostDomain(workspaceId);
            domainId = getDomainRes.response.id;
            workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
            getFacetResponse = await getFacet(domainId, window.location.pathname);
            const properFacetArr = parsePath(get(getFacetResponse, 'response.domElement[0].path'), false);
            facetsArr = [];
            properFacetArr && properFacetArr.forEach(ff => {
                $(ff).css("opacity", "0.3", "important");
                facetsArr.push(ff);
            });
        }
        const all = [...facetsArr, ...hiddenPaths];
        // getting rid of duplicates
        hiddenPaths = CustomProxy([...new Set(all)], observerFunctions);
        [...document.querySelectorAll('* > :not(#facetizer) * > :not(#popup) *')]
            .filter(e => ![...document.querySelectorAll("#facetizer *, #popup *")]
                .includes(e)).forEach(e => {
                    e.selectedFacet = selectedFacet;
                    e.facetMap = facetMap;
                    if (flag) {
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