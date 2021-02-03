/**
 * IIFE that injects @param {disableMutationObserverScript} into the current page.
 * The value is determined by the boolean attribute `facet-extension-loaded` which is defined through `mutationObserverVariableInjection.js`.
 */

(async function () {
    console.log('[facet-extension-add-mo-script]');

    const keys = {
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

    const scriptTagVal = getFacetExtensionCookie(keys['FACET_EXTENSION_INJECTING_SCRIPT_TAG']);
    const alreadyIntegrated = (getFacetExtensionCookie(keys["FACET_EXTENSION_ALREADY_INTEGRATED"]) === 'true');
    const previewId = getFacetExtensionCookie(keys["FACET_EXTENSION_PREVIEW_TAB_ID"]);

    console.log('alreadyIntegrated', alreadyIntegrated, 'previewId', previewId);

    if (!alreadyIntegrated) {
        var node = document.getElementsByTagName('html').item(0);
        node.style.visibility = "hidden";

        var scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'text/javascript');
        scriptTag.setAttribute('src', 'facet-mutation-observer.js');
        // node.prepend(scriptTag);
    }
})();