import { setKeyInLocalStorage } from "../src/shared/loadLocalStorage";

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        console.log('ehy!', request);
        // need to grab from shared
        if (request.data === 'OPEN_WELCOME_PAGE') {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                var currTab = tabs[0];
                chrome.tabs.create({ url: chrome.extension.getURL(`welcome.html?redirectTabId=${currTab.id}`) });
            });
            return;
        } else if (request.data === 'OPEN_PREVIEW_PAGE') {
            setKeyInLocalStorage('IS_PREVIEW', true)

            // chrome.storage && chrome.storage.sync.get('facet-settings', function (obj) {
            //     var node = document.getElementsByTagName('html')[0];
            //     var script = document.createElement('script');
            //     const val = Boolean(obj && obj['facet-settings'] && obj['facet-settings']['isPluginEnabled']);
            //     script.setAttribute('type', 'text/javascript');
            //     script.setAttribute('src', file_path);
            //     script.setAttribute('facet-extension-loaded', val);
            //     node.appendChild(script);
            // });


            chrome.tabs.create({ url: "https://google.com" }, function (tab) {
                chrome.tabs.executeScript(tab.id, { file: 'content.js' });
            });
        }
    },
);