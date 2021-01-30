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
            chrome.tabs.create({ url: request.config.href }, function (tab) {
                chrome.tabs.executeScript(tab.id, {
                    code: `
                        // needed for content-script state management
                        window.IN_PREVIEW = true;
                        window.JSURL = "${request.config.jsUrl}";
                        window.disableMutationObserverScript = false;
                        console.log('[Facet][Initiating Preview]');
                        // not injecting the script for already-integrated applications
                        if (${request.config.alreadyIntegrated}) {
                            const scriptArr = document.querySelectorAll('script');
 
                            var node = document.getElementsByTagName('html').item(0);
                            var script = document.createElement('script');
                            script.setAttribute('type', 'text/javascript');
                            script.setAttribute('facet-extension-loaded', false);
                            script.setAttribute('is-preview', "true");
                            script.setAttribute('already-integrated', ${request.config.alreadyIntegrated});
                            node.appendChild(script);
                        } else {
                            document.getElementById('facetizer') && document.getElementById('facetizer').remove();
                            var node = document.getElementsByTagName('html').item(0);
                            var script = document.createElement('script');
                            script.setAttribute('type', 'text/javascript');
                            script.setAttribute('src', "${request.config.jsUrl}");
                            script.setAttribute('facet-extension-loaded', false);
                            script.setAttribute('already-integrated', ${request.config.alreadyIntegrated});
                            node.appendChild(script);

                            node.style.visibility = "hidden";

                            var previewNode = document.createElement('div');
                            previewNode.setAttribute('id', 'facet-preview-loading-bar');
                            node.appendChild(previewNode);
                        }
                    `,
                    runAt: 'document_start',
                });
            });
        }
    },
);