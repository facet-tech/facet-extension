/**
 * Injects @param {disableMutationObserverScript} into the current page.
 * The value is determined by the boolean attribute `facet-extension-loaded` which is defined through `mutationObserverVariableInjection.js`.
 */
window.disableMutationObserverScript = false;
const scriptArr = document.querySelectorAll('script');
let found = false;
if (!window.IN_PREVIEW) {
    scriptArr.forEach(script => {
        if (found) {
            return;
        }
        if (script.attributes && script.attributes['is-preview']) {
            window.disableMutationObserverScript = false;
            found = true;
            return;
        }
        if (script.attributes && script.attributes['facet-extension-loaded']) {
            window.disableMutationObserverScript = script.getAttribute("facet-extension-loaded") === "true" ? true : false;
            console.log('CHECKME', disableMutationObserverScript);
        }
    })
}

