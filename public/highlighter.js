console.log('@highlighter');
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//     switch (message.action) {
//         case "popupOpen": {
//             console.log('popup is open');
//             chrome.tabs.executeScript({ file: "highlighter2.js" });
//             // chrome.tabs.executeScript({
//             //     code: 'document.body.style.backgroundColor="red"'
//             // });
//         }
//             break;
//     }
// });

window.highlightMode = false;

var onMouseEnterHandle = function (event) {
    event.target.style.border = '1px solid black';
    event.target.style.cursor = "pointer";
};

var onMouseLeaveHandle = function (event) {
    event.target.style.border = "none";
}

var onMouseClickHandle = function (event) {
    console.log('mode', window.highlightMode);
    console.log('@CLICK', event.target.id);
    // event.preventDefault();
    // event.stopPropagation();
    if (!event.target.id) return;
    window.selectedDOM = event.target.id;
    window.postMessage(event.target.id, "*");
    // onAddElement();
}

try {
    console.log('RUNNING SCRIPT @LOAD');
    //moving #root into body

    // $("body").prepend($("#root"))
    // var iframe = document.getElementById("fixed-container");
    var innerDoc = document;
    // var body = innerDoc.body;
    // var root = innerDoc.getElementById('root');
    // body.prepend(root);
    let count = 0;

    [...document.querySelectorAll('body * > :not(#root)')].
        filter(e => ![...document.querySelectorAll("#root *")].includes(e)).forEach(e => {
            console.log('kappa!')
            e.addEventListener("click", onMouseClickHandle, false);
            e.addEventListener("mouseenter", onMouseEnterHandle, false);
            e.addEventListener("mouseleave", onMouseLeaveHandle, false);
        });
    // document.querySelectorAll('#viewport *').forEach(e => {
    // e.addEventListener("click", onMouseClickHandle, false);
    // count += 1;
    // });
    console.log('count!', count);
} catch (e) {
    console.log('@CATCH', e)
}
