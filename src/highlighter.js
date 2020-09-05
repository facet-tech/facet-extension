window.highlightMode = false;
let hiddenPaths = [];

var onMouseEnterHandle = function (event) {
    event.target.style.border = '1px solid black';
    event.target.style.cursor = "pointer";
};

var onMouseLeaveHandle = function (event) {
    event.target.style.border = "none";
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
    console.log('hiddenPaths', hiddenPaths)
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

// flag: true => add event; else remove event
const updateEvents = (flag) => {
    //simple vers:
    // [...document.querySelectorAll('body * > :not(#root)')].forEach(e => {
    //      if (flag) {
    //             e.addEventListener("click", onMouseClickHandle, false);
    //             e.addEventListener("mouseenter", onMouseEnterHandle, false);
    //             e.addEventListener("mouseleave", onMouseLeaveHandle, false);
    //         } else {
    //             e.removeEventListener("click", onMouseClickHandle, false);
    //             e.removeEventListener("mouseenter", onMouseEnterHandle, false);
    //             e.removeEventListener("mouseleave", onMouseLeaveHandle, false);
    //         }
    // })

    [...document.querySelectorAll('body * > :not(#root)')].
        filter(e => ![...document.querySelectorAll("#root *")].includes(e)).forEach(e => {

            // console.log('kappa!')
            if (flag) {
                e.addEventListener("click", onMouseClickHandle, false);
                e.addEventListener("mouseenter", onMouseEnterHandle, false);
                e.addEventListener("mouseleave", onMouseLeaveHandle, false);
            } else {
                e.removeEventListener("click", onMouseClickHandle, false);
                e.removeEventListener("mouseenter", onMouseEnterHandle, false);
                e.removeEventListener("mouseleave", onMouseLeaveHandle, false);
            }
            // e.removeEventListener("click", onMouseClickHandle, false);
            // e.removeEventListener("mouseenter", onMouseEnterHandle, false);
            // e.removeEventListener("mouseleave", onMouseLeaveHandle, false);

        });

    // [...document.querySelectorAll('body * > :not(#root)')].
    //     filter(e => ![...document.querySelectorAll("#root *")].includes(e)).forEach(e => {

    //         console.log('kappa!')
    //         if (flag) {
    //             e.addEventListener("click", onMouseClickHandle, false);
    //             e.addEventListener("mouseenter", onMouseEnterHandle, false);
    //             e.addEventListener("mouseleave", onMouseLeaveHandle, false);
    //         } else {
    //             e.removeEventListener("click", onMouseClickHandle, false);
    //             e.removeEventListener("mouseenter", onMouseEnterHandle, false);
    //             e.removeEventListener("mouseleave", onMouseLeaveHandle, false);
    //         }
    //         // e.removeEventListener("click", onMouseClickHandle, false);
    //         // e.removeEventListener("mouseenter", onMouseEnterHandle, false);
    //         // e.removeEventListener("mouseleave", onMouseLeaveHandle, false);

    //     });
}
updateEvents(true);

// try {
//     console.log('RUNNING SCRIPT @LOAD');
//     //moving #root into body

//     // $("body").prepend($("#root"))
//     // var iframe = document.getElementById("fixed-container");
//     var innerDoc = document;
//     // var body = innerDoc.body;
//     // var root = innerDoc.getElementById('root');
//     // body.prepend(root);
//     let count = 0;

//     [...document.querySelectorAll('body * > :not(#root)')].
//         filter(e => ![...document.querySelectorAll("#root *")].includes(e)).forEach(e => {
//             console.log('kappa!')
//             e.addEventListener("click", onMouseClickHandle, false);
//             e.addEventListener("mouseenter", onMouseEnterHandle, false);
//             e.addEventListener("mouseleave", onMouseLeaveHandle, false);

//             // e.removeEventListener("click", onMouseClickHandle, false);
//             // e.removeEventListener("mouseenter", onMouseEnterHandle, false);
//             // e.removeEventListener("mouseleave", onMouseLeaveHandle, false);

//         });
//     console.log('count!', count);
// console.log('count!', count);
// } catch (e) {
//     console.log('@CATCH', e)
// }

export { updateEvents };