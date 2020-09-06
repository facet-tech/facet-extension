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
    var path = getDomPath(event.target);
    var res = path.join(' > ');
    if (hiddenPaths.includes(res)) {
        hiddenPaths = hiddenPaths.filter(e => e !== res);
        event.target.style.setProperty("background-color", "unset");
    } else {
        event.target.style.setProperty("background-color", "red", "important");
        hiddenPaths.push(res);
    }
    var mmap = new Map(window.addedElements);
    var existingVals = window.addedElements && window.addedElements.get('Default-Facet') ? window.addedElements.get('Default-Facet') : [];
    mmap.set('Default-Facet', [...existingVals, [path[path.length - 1]]]);
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
    return stack.slice(1); // removes the html element
}

const updateEvents = (flag) => {
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

const pushDown = () => {
    [...document.querySelectorAll('body * > :not(#facetizer)')].
        filter(e => ![...document.querySelectorAll("#facetizer *")].includes(e)).forEach(e => {
            console.log('ELEME', e);
        });
}

export { updateEvents };