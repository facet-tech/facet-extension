chrome.runtime.onMessage.addListener(
    async function (request) {
        // need to grab from shared
        if (request.data === 'OPEN_WELCOME_PAGE') {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                var currTab = tabs[0];
                chrome.tabs.create({ url: chrome.extension.getURL(`welcome.html?redirectTabId=${currTab.id}`) });
            });
            return;
        } else if (request.data === 'OPEN_PREVIEW_PAGE') {
            await chrome.tabs.create({ url: request.config.url }, function (tab) {
                const value = {
                    IN_PREVIEW: true,
                    DISABLE_MO: false,
                    TAB_ID: tab.id
                };

                chrome.cookies.set({
                    url: request.config.url,
                    name: "FACET",
                    value: JSON.stringify(value)
                }, (cookie) => {
                    console.log(JSON.stringify(cookie));
                    console.log(chrome.extension.lastError);
                    console.log(chrome.runtime.lastError);
                });
                // chrome.tabs.executeScript(tab.id, {
                //     code: `
                //         // needed for content-script state management
                //         window.IN_PREVIEW = true;
                //         window.JSURL = "${request.config.jsUrl}";
                //         console.log('@BG',)
                //         window.disableMutationObserverScript = true;
                //         console.log('SETTING 4', window.disableMutationObserverScript);
                //         console.log('[Facet][Initiating Preview]');
                //         // not injecting the script for already-integrated applications
                //         if (${request.config.alreadyIntegrated}) {
                //             const scriptArr = document.querySelectorAll('script');

                //             var node = document.getElementsByTagName('html').item(0);
                //             var script = document.createElement('script');
                //             script.setAttribute('type', 'text/javascript');
                //             script.setAttribute('facet-extension-loaded', false);
                //             script.setAttribute('is-preview', "true");
                //             script.setAttribute('already-integrated', ${request.config.alreadyIntegrated});
                //             node.appendChild(script);
                //         } else {
                //             document.getElementById('facetizer') && document.getElementById('facetizer').remove();
                //             var node = document.getElementsByTagName('html').item(0);
                //             var script = document.createElement('script');
                //             script.setAttribute('type', 'text/javascript');
                //             script.setAttribute('src', "${request.config.jsUrl}");
                //             script.setAttribute('facet-extension-loaded', false);
                //             script.setAttribute('already-integrated', ${request.config.alreadyIntegrated});
                //             node.appendChild(script);

                //             node.style.visibility = "hidden";

                //             var previewNode = document.createElement('div');
                //             previewNode.setAttribute('id', 'facet-preview-loading-bar');
                //             node.appendChild(previewNode);
                //         }
                //     `,
                //     runAt: 'document_start',
                // });
            });
        }
    },
);