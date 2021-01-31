/**
 * IIFE that injects @param {disableMutationObserverScript} into the current page.
 * The value is determined by the boolean attribute `facet-extension-loaded` which is defined through `mutationObserverVariableInjection.js`.
 */

(async function () {

    const keysObj = {
        FACET_EXTENSION_PREVIEW_TAB_ID: 'FACET_EXTENSION_PREVIEW_TAB_ID',
        FACET_EXTENSION_DISABLE_MO: 'FACET_EXTENSION_DISABLE_MO',
        FACET_EXTENSION_ALREADY_INTEGRATED: 'FACET_EXTENSION_ALREADY_INTEGRATED',
        FACET_EXTENSION_INJECTING_SCRIPT_TAG: 'FACET_EXTENSION_INJECTING_SCRIPT_TAG'
    };

    function getFacetExtensionCookie(key) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${key}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    }

    const alreadyIntegrated = (getFacetExtensionCookie(keysObj["FACET_EXTENSION_ALREADY_INTEGRATED"]) === 'true');
    // TODO change 
    const scriptTagVal = getFacetExtensionCookie(keysObj['FACET_EXTENSION_INJECTING_SCRIPT_TAG']).replace("https://api.facet.run/", "http://localhost:3002/");;
    if (!alreadyIntegrated) {
        var node = document.getElementsByTagName('html').item(0);
        node.style.visibility = "hidden";

        var scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'text/javascript');
        scriptTag.setAttribute('src', scriptTagVal);
        node.prepend(scriptTag);
    }
})();