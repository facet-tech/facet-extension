import $ from 'jquery';
import { getKeyFromLocalStorage } from './shared/loadLocalStorage';
import { getFacet, getDomain, createDomain } from './services/facetApiService';
import parsePath from './shared/parsePath';
import { api } from './shared/constant';
import get from 'lodash/get';
import CustomProxy from './utils/CustomProxy';

// is this needed?
window.highlightMode = false;
// singleton
let hiddenPaths;

const onMouseEnterHandle = function (domElement) {
    domElement.target.style.setProperty("outline", "5px ridge #c25d29");
    domElement.target.style.setProperty("cursor", "pointer");
};

const onMouseLeaveHandle = function (domElement) {
    domElement.target.style.setProperty("outline", "unset");
    domElement.target.style.setProperty("cursor", "unset");
}

const onMouseClickHandle = function (event) {
    const res = getDomPath(event.target);
    if (hiddenPaths.includes(res)) {
        hiddenPaths = hiddenPaths.filter(e => e !== res);
        event.target.style.setProperty("opacity", "unset");
    } else {
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

const updateEvents = async (flag, observerFunctions, hiddenPathsArr) => {
    try {
        if (!hiddenPaths) {
            hiddenPaths = hiddenPathsArr;
        }
        const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
        let getDomainRes = await getDomain(window.location.hostname, workspaceId);
        // duplicate code to be fixed...
        let domainId;
        const domainExists = getDomainRes && getDomainRes.response.id !== undefined;
        // create domain if it doesn't exist
        if (domainExists) {
            domainId = get(getDomainRes, 'response.id');
        } else {
            const domainRes = await createDomain(window.location.hostname, workspaceId);
            domainId = get(domainRes, 'response.id');
        }
        const getFacetResponse = await getFacet(domainId, window.location.pathname);
        const properFacetArr = parsePath(get(getFacetResponse, 'response.domElement[0].path'), false);
        let facetsArr = [];
        properFacetArr && properFacetArr.forEach(ff => {
            $(ff).css("opacity", "0.3", "important");
            facetsArr.push(ff);
        });
        const all = [...facetsArr, ...hiddenPaths];
        // getting rid of duplicates
        hiddenPaths = CustomProxy([...new Set(all)], observerFunctions);
        [...document.querySelectorAll('* > :not(#facetizer) * > :not(#popup) *')]
            .filter(e => ![...document.querySelectorAll("#facetizer *, #popup *")]
                .includes(e)).forEach(e => {
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