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

var onMouseEnterHandle = function (event) {
    event.target.style.border = '1px solid black';
    event.target.style.cursor = "pointer";
};

var onMouseLeaveHandle = function (event) {
    event.target.style.border = "none";
}

var onMouseClickHandle = function (event) {
    console.log('@CLICK', event.target.id);
    event.preventDefault();
    event.stopPropagation();
    if (!event.target.id) return;
    window.selectedDOM = event.target.id;
    window.postMessage(event.target.id, "*");
    // onAddElement();
}

try {
    console.log('RUNNING SCRIPT @LOAD');
    // var iframe = document.getElementById("fixed-container");
    var innerDoc = document;
    innerDoc.querySelectorAll('*').forEach(e => {
        e.addEventListener("mouseenter", onMouseEnterHandle, false);
        e.addEventListener("mouseleave", onMouseLeaveHandle, false);
        e.addEventListener("click", onMouseClickHandle, false);
    });
} catch (e) {
    console.log('@CATCH', e)
}
