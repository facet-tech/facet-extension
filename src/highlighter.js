import $ from 'jquery';

window.highlightMode = false;
let hiddenPaths = [];

var onMouseEnterHandle = function (event) {
    event.target.style.border = '1px solid black';
    event.target.style.cursor = "pointer";
};

var onMouseLeaveHandle = function (event) {
    event.target.style.setProperty("border", "unset");
    event.target.style.setProperty("cursor", "unset");
}

var onMouseClickHandle = function (event) {
    // Usage:
    var res = getDomPath(event.target);
    if (hiddenPaths.includes(res)) {
        hiddenPaths = hiddenPaths.filter(e => e !== res);
        event.target.style.setProperty("background-color", "unset");
    } else {
        event.target.style.setProperty("background-color", "red", "important");
        hiddenPaths.push(res);
    }
    var mmap = new Map(window.addedElements);
    window.setAddedElements(mmap);
    event.preventDefault();
    event.stopPropagation();
    window.hiddenPaths = hiddenPaths;
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
    // var secondParthWithoutFacetizer = computeWithoutFacetizer(res);
    // var split1 = res.split('>');
    // split1[1] = secondParthWithoutFacetizer;
    // return split1.join('>')
    return res;
}

var computeWithoutFacetizer = (res) => {
    var splitStr = res.split('>');
    if (splitStr.length < 2) {
        return res;
    }
    var secondPathSplit = splitStr[1].split(':eq');
    console.log('secondPathSplit', secondPathSplit)
    if (secondPathSplit.length < 2) {
        return res;
    }
    var mStr = secondPathSplit[1].trim();
    console.log('MSTR', mStr);
    var newRes = ':eq';
    let rightNumber;
    for (let i = 0; i < mStr.length; i++) {
        if (mStr.charAt(i) === ")" || mStr.charAt(i) === "(") {
            newRes += mStr.charAt(i);
        } else {
            // console.log('EHE', mStr.charAt(i));
            let seeme = parseInt(mStr.charAt(i) - 1);
            rightNumber = seeme;
            newRes += seeme;
        }
    }
    let wanted = `${secondPathSplit[0].trim()}:eq(${rightNumber})`;
    console.log('WANTED', wanted);
    return wanted;
}

const fetchFacets = async () => {
    // HTTP CALL
    const url = `https://api.facet.ninja/facet/${window.btoa(window.location.href)}`;
    const response = await fetch(url, {
        method: 'GET',
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

const updateEvents = async (flag) => {
    const facets = await fetchFacets();
    let facetsArr = [];
    facets && facets.facet.forEach(f => {
        console.log('f', f)
        f.id.forEach(ff => {
            console.log('wdaddwaf', ff)
            $(ff).css('background-color', 'red');
            console.log(ff)
            facetsArr.push(ff)
        })
    })
    // var mmap = new Map(facetsArr);
    // window.setAddedElements(mmap);
    console.log('FACETS', facets);
    // preload


    [...document.querySelectorAll('body * > :not(#facetizer)')].
        filter(e => ![...document.querySelectorAll("#facetizer *")].includes(e)).forEach(e => {
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
updateEvents(true);

const pushDownFixedElement = () => {
    [...document.querySelectorAll('body * > :not(#facetizer)')].
        filter(e => ![...document.querySelectorAll("#facetizer *")].includes(e)).forEach(element => {
            // console.log('ELEME', element);
            if (element.style.position === 'fixed' || getComputedStyle(element).position === 'fixed') {
                // element.style.top = '45px';
                element.style.setProperty("top", "45px");
                element.style.setProperty("position", "absolute");
            }
        });
}

export { updateEvents, pushDownFixedElement, computeWithoutFacetizer };