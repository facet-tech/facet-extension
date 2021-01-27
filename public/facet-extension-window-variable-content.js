/**
 * Injects @param {disableMutationObserverScript} into the current page.
 * The value is determined by the boolean attribute `facet-extension-loaded` which is defined through `mutationObserverVariableInjection.js`.
 */
window.disableMutationObserverScript = false;
const scriptArr = document.querySelectorAll('script');
let found = false;
scriptArr.forEach(script => {
    if (found) {
        return;
    }
    if (script.attributes && script.attributes['is-preview']) {
        window.disableMutationObserverScript = false;
        window.IN_PREVIEW = true;
        window.JSURL = script.attributes['src'];
        found = true;
        var node = document.getElementsByTagName('html').item(0);
        node.style.visibility = "hidden";
        var previewNode = document.createElement('div');
        previewNode.setAttribute('src', window.JSURL);
        node.prepend(previewNode);
        return;
    }
    if (script.attributes && script.attributes['facet-extension-loaded']) {
        window.disableMutationObserverScript = script.getAttribute("facet-extension-loaded") === "true" ? true : false;
    }
})
