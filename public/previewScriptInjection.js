
async function injectScript(file_path, tag) {
    alert('hi!')
    var node = document.getElementsByTagName('html')[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('facet-extension-loaded', false);

    // TODO do dynamically
    script.setAttribute('src', 'https://api.facet.ninja/facet.ninja.js?id=DOMAIN~OGMzMmJiMTMtYzViNS00NGU0LThlOTQtMWY1ODE3Yzc1Mjcx');
    node.appendChild(script);
}
injectScript(chrome.extension.getURL('facet-extension-window-variable-content.js'), 'body');
