import $ from 'jquery';
window.highlightMode = false;
let hiddenPaths = [];

var onMouseEnterHandle = function (event) {
    // event.target.style.borderBottom = '1px solid black';
    // event.target.style.cursor = "pointer";
    event.target.style.setProperty("outline", "5px ridge #c25d29");
    event.target.style.setProperty("cursor", "pointer");
};

var onMouseLeaveHandle = function (event) {
    event.target.style.setProperty("outline", "unset");
    event.target.style.setProperty("cursor", "unset");
}

var onMouseClickHandle = function (event) {
    // Usage:
    var res = getDomPath(event.target);
    if (window.hiddenPaths.includes(res)) {
        window.hiddenPaths = hiddenPaths.filter(e => e !== res);
        event.target.style.setProperty("opacity", "unset");
    } else {
        event.target.style.setProperty("opacity", "0.3", "important");
        window.hiddenPaths.push(res);
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
    return res;
}

var computeWithoutFacetizer = (res) => {
    var splitStr = res.split('>');
    var secondPathSplit = splitStr[1].split(':eq');
    if (secondPathSplit.length < 2 || !secondPathSplit[0].includes('div')) {
        return splitStr[1];
    }
    var regExp = /\(([^)]+)\)/;
    var matches = regExp.exec(secondPathSplit[1]);
    const currNumber = parseInt(matches[1]);
    const wantedNumber = currNumber - 1;
    const result = `${secondPathSplit[0]}:eq(${wantedNumber})`;

    return result;
}

const fetchFacets = async () => {
    const url = `https://api.facet.ninja/facet/${window.btoa(window.location.href)}`;
    const response = await fetch(url, {
        method: 'GET',
    });
    return response.json();
}

const updateEvents = async (flag) => {
    const facets = await fetchFacets();
    let facetsArr = [];
    facets && facets.facet.forEach(f => {
        f && f.id && f.id.forEach(ff => {
            $(ff).css("opacity", "0.3", "important");
            facetsArr.push(ff);
        })
    })
    window.hiddenPaths = [...facetsArr];
    [...document.querySelectorAll('* > :not(#facetizer) * > :not(#popup) *')]
        .filter(e => ![...document.querySelectorAll("#facetizer *, #popup *")].includes(e)).forEach(e => {
            if (flag) {
                e.addEventListener("click", onMouseClickHandle, false);
                e.addEventListener("mouseenter", onMouseEnterHandle, false);
                e.addEventListener("mouseleave", onMouseLeaveHandle, false);
            } else {
                e.removeEventListener("click", onMouseClickHandle, false);
                e.removeEventListener("mouseenter", onMouseEnterHandle, false);
                e.style.cursor = "cursor";
                e.removeEventListener("mouseleave", onMouseLeaveHandle, false);
            }
        });
}

export { updateEvents, computeWithoutFacetizer };