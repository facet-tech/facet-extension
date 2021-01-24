// import { setKeyInLocalStorage } from "../src/shared/loadLocalStorage";

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
            chrome.tabs.create({ url: request.config.href }, function (tab) {
                chrome.tabs.executeScript(tab.id, {
                    code: `
                        window.IN_PREVIEW = true;
                        document.getElementById('facetizer') && document.getElementById('facetizer').remove()
                        var tmp = document.getElementsByTagName('html')[0]
                        var node = document.getElementsByTagName('html').item(0);
                        var script = document.createElement('script');
                        script.setAttribute('type', 'text/javascript');
                        script.setAttribute('src', "${request.config.jsUrl}");
                        script.setAttribute('facet-extension-loaded', false);
                        script.setAttribute('is-preview', true);
                        node.appendChild(script);
                    `,
                    runAt: 'document_start',
                });
            });
        }
    },
);