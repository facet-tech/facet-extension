chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        // need to grab from shared
        if (request.data === 'OPEN_WELCOME_PAGE') {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                var currTab = tabs[0];
                chrome.tabs.create({ url: chrome.extension.getURL(`welcome.html?redirectTabId=${currTab.id}`) });
            });
            return;
        } else if (request.data === 'OPEN_PREVIEW_PAGE') {
            await chrome.tabs.create({ url: request.config.url }, function (tab) {
                console.log('[FACET][Background] SETTING COOKIES FOR ', request.config, ":", request.config);
                chrome.cookies.set({
                    url: request.config.url,
                    name: `FACET_EXTENSION_DISABLE_MO`,
                    value: "false"
                });

                chrome.cookies.set({
                    url: request.config.url,
                    name: `FACET_EXTENSION_PREVIEW_TAB_ID`,
                    value: tab.id.toString()
                });

                chrome.cookies.set({
                    url: request.config.url,
                    name: `FACET_EXTENSION_ALREADY_INTEGRATED`,
                    value: request.config.alreadyIntegrated.toString()
                });

                chrome.cookies.set({
                    url: request.config.url,
                    name: `FACET_EXTENSION_INJECTING_SCRIPT_TAG`,
                    value: request.config.injectingScriptTag
                });

                chrome.cookies.set({
                    url: request.config.url,
                    name: `DURING_PREVIEW`,
                    value: "true"
                });

                chrome.tabs.executeScript(tab.id, {
                    file: 'preview-click-content.js',
                    runAt: 'document_start',
                });
            });
        } else if (request.data === 'GET_CURRENT_TAB') {
            if (sender.tab && sender.tab.id) {
                sendResponse({ tabId: sender.tab.id });
            } else {
                sendResponse({ tabId: undefined });
            }
        } else if (request.data === 'SET_COOKIE_VALUE') {
            chrome.cookies.set({
                url: request.config.url,
                name: request.config.name,
                value: request.config.value
            });
        }
    },
);