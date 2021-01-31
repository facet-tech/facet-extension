/**
 * taken from https://gist.github.com/devjin0617/3e8d72d94c1b9e69690717a219644c7a
 * 
 * Injects facet-extension-window-variable-content.js
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
(async function () {

    async function injectScript(file_path, tag) {
        chrome.storage && chrome.storage.sync.get('facet-settings', function (obj) {
            var node = document.getElementsByTagName('html')[0];
            var script = document.createElement('script');
            const val = Boolean(obj && obj['facet-settings'] && obj['facet-settings']['isPluginEnabled']);
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', file_path);
            script.setAttribute('facet-extension-loaded', val);
            node.appendChild(script);
        });
    }

    const keys = {
        'FACET_EXTENSION_DISABLE_MO': 'FACET_EXTENSION_DISABLE_MO',
        'FACET_EXTENSION_PREVIEW_TAB_ID': 'FACET_EXTENSION_PREVIEW_TAB_ID',
        'FACET_EXTENSION_ALREADY_INTEGRATED': 'FACET_EXTENSION_ALREADY_INTEGRATED',
    }

    function getFacetExtensionCookie(key) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${key}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    }

    const previewId = getFacetExtensionCookie(keys["FACET_EXTENSION_PREVIEW_TAB_ID"]);

    await chrome.runtime.sendMessage({
        data: 'GET_CURRENT_TAB'
    }, async (response) => {
        // response.tabId 
        console.log('currTabId', response.tabId, 'VS', previewId);
        const val = response.tabId != previewId;
        console.log('RESULT', val.toString())
        await chrome.runtime.sendMessage({
            data: 'SET_COOKIE_VALUE',
            config: {
                url: window.location.origin,
                name: 'FACET_EXTENSION_DISABLE_MO',
                value: val.toString()
            }
        });
    });



    console.log("INJECTING facet-extension-window-variable-content.js");
    injectScript(chrome.extension.getURL('facet-extension-window-variable-content.js'), 'body');
})();
