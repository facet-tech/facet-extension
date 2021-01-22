window.disableMutationObserverScript = false;
const scriptArr = document.querySelectorAll('script');
scriptArr.forEach(script => {
    if (script.attributes && script.attributes['facet-extension-loaded']) {
        window.disableMutationObserverScript = script.getAttribute("facet-extension-loaded") === "true" ? true : false;
    }
})
