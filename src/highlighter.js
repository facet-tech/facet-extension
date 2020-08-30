console.log('@highlighter');
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
    console.log(window.setAddedElements);
    var newMap = new Map(window.addedElements);
    window.setAddedElements(newMap);
    // event.preventDefault();
    // event.stopPropagation();
    if (!event.target.id) return;
    window.selectedDOM = event.target.id;
    window.postMessage(event.target.id, "*");
}

// flag: true => add event; else remove event
const updateEvents = (flag) => {

    [...document.querySelectorAll('body * > :not(#root)')].
        filter(e => ![...document.querySelectorAll("#root *")].includes(e)).forEach(e => {
            console.log('kappa!');
            if (flag) {
                e.addEventListener("click", onMouseClickHandle, false);
                e.addEventListener("mouseenter", onMouseEnterHandle, false);
                e.addEventListener("mouseleave", onMouseLeaveHandle, false);
            } else {
                e.removeEventListener("click", onMouseClickHandle, false);
                e.removeEventListener("mouseenter", onMouseEnterHandle, false);
                e.removeEventListener("mouseleave", onMouseLeaveHandle, false);
            }
        });
}
updateEvents(true);

export { updateEvents };