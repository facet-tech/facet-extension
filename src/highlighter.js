import $ from 'jquery';
console.log('@HIGHLIGHTER');
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
    if (window.hiddenPaths.includes(res)) {
        window.hiddenPaths = hiddenPaths.filter(e => e !== res);
        event.target.style.setProperty("background-color", "unset");
    } else {
        event.target.style.setProperty("background-color", "red", "important");
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
    console.log('MPIKA',res);
    var splitStr = res.split('>');
    var secondPathSplit = splitStr[1].split(':eq');
    console.log('@secondPathSplit',secondPathSplit,secondPathSplit.length,'CONTAINS',splitStr[0].includes('div'));
    if (secondPathSplit.length < 2 || !secondPathSplit[0].includes('div')) {
        console.log('BGIKA2')
        return splitStr[1];
    }
    var regExp = /\(([^)]+)\)/;
    var matches = regExp.exec(secondPathSplit[1]);

    //matches[1] contains the value between the parentheses
    console.log(matches[1]);
    const currNumber = parseInt(matches[1]);

    const wantedNumber = currNumber - 1;
    const result = `${secondPathSplit[0]}:eq(${wantedNumber})`;
    console.log('RESULT', result);
    return result;
    // var mStr = secondPathSplit[1].trim();
    // var newRes = ':eq';
    // let rightNumber;
    // for (let i = 0; i < mStr.length; i++) {
    //     if (mStr.charAt(i) === ")" || mStr.charAt(i) === "(") {
    //         newRes += mStr.charAt(i);
    //         console.log('mpika1!', newRes);
    //     } else {
    //         console.log('mpika2!', newRes);
    //         let seeme = parseInt(mStr.charAt(i) - 1);
    //         rightNumber = seeme;
    //         newRes += seeme;
    //     }
    // }
    // let wanted = `${secondPathSplit[0].trim()}:eq(${rightNumber})`;
    // return wanted;
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
            $(ff).css('background-color', 'red');
            facetsArr.push(ff);
        })
    })
    window.hiddenPaths = [...facetsArr];
    [...document.querySelectorAll('body * > :not(#facetizer) :not(#popup)')]
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
updateEvents(true);

const pushDownFixedElement = () => {
    [...document.querySelectorAll('body * > :not(#facetizer)')]
        .filter(e => ![...document.querySelectorAll("#facetizer *")].includes(e)).forEach(element => {
            if (element.style.position === 'fixed' || getComputedStyle(element).position === 'fixed') {
                element.style.setProperty("top", "45px");
                element.style.setProperty("position", "absolute");
            }
        });
}

export { updateEvents, pushDownFixedElement, computeWithoutFacetizer };