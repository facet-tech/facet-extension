
/**
 * taken from https://gist.github.com/devjin0617/3e8d72d94c1b9e69690717a219644c7a
 * 
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
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
injectScript(chrome.extension.getURL('facet-extension-window-variable-content.js'), 'body');