async function injectScript(file_path, tag) {
    window.disableMutationObserverScript = false;
    const src = "https://api.facet.ninja/facet.ninja.js?id=DOMAIN~OGMzMmJiMTMtYzViNS00NGU0LThlOTQtMWY1ODE3Yzc1Mjcx";
    // var node = document.getElementsByTagName('html')[0];
    // var script = document.createElement('script');
    // script.setAttribute('type', 'text/javascript');
    // script.setAttribute('src', `https://api.facet.ninja/facet.ninja.js?id=DOMAIN~OGMzMmJiMTMtYzViNS00NGU0LThlOTQtMWY1ODE3Yzc1Mjcx`);
    // node.appendChild(script);

    chrome.storage && chrome.storage.sync.get('facet-settings', async function (obj) {


        // const val = Boolean(obj && obj['facet-settings'] && obj['facet-settings']['IS_PREVIEW']);
        // const jwt = `eyJraWQiOiIrKzZGaFhvcXpwMkhaakV6Z254Q0JobFR6cWZmdFJNQlFDYnZ0dzRUMHh3PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzMTNkNTYzYy0xOWRhLTQ2ODgtYWE5Yi1lNDBlMzdhOWY5YjAiLCJldmVudF9pZCI6IjYwNmMzNWUzLWJiMjItNGNhYi1iNDBiLWMzNzJkMDAxYTlhOCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2MTE0MzI2ODMsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX29NNG5lNmNTZiIsImV4cCI6MTYxMTQzNjI4MywiaWF0IjoxNjExNDMyNjgzLCJqdGkiOiJmYTBkNGQ3MS1lN2ZjLTQ3OGMtOTU4ZS0yM2E1ZmFkZGQwZTEiLCJjbGllbnRfaWQiOiI2ZmE0ZmhjdG5vanVmM2htbHZvMG12c3AwMiIsInVzZXJuYW1lIjoibGF5YW5pLmthbW9yYUBwcmltYXJ5YWxlLmNvbSJ9.nEVxKa2cwAnvxxqI2nh8wkoeynYFYEqIxD7vWHadfCiuC-ppWiEwS-JcdJQrWN3uUwKXUxMUTMWKdPTcayErZJv_Nv3rjIUqJHpy30XG5PlaeCzV1MivOzWzlvqB_TYhLpuoKwpFWJPocPnN9p20w14zm-tDCryQaGu2xwgmE8hqhoaXA39r1kx08VJGBJ1NxC4g60dDP23UZGShQ2nQG2pydvXUrSR0QlkW0g0XXrebNiKwwTL4M8Hy9OBkUDQ7afogVWudTMP2SaAM2Oqkbz8lLNkor9HXo9k2tk4fyn3NpDKPfPy6KwNeSUDhEYy9jgGKb5xzS-CRkUg2dJq8_w`;
        // let headers = {
        //     AccessToken: jwt,
        // };
        // let objFetch = { mehtod: 'GET', headers };
        // const workspaceId = obj['facet-settings']['workspaceId'];
        // const url = `https://api.facet.ninja/domain?domain=${window.location.hostname}&workspaceId=${workspaceId}`;
        // const res = await fetch(url, objFetch);
        // const response = await res.json();

        var node = document.getElementsByTagName('html')[0];
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('async', true);
        script.setAttribute('src', `https://api.facet.ninja/facet.ninja.js?id=DOMAIN~OGMzMmJiMTMtYzViNS00NGU0LThlOTQtMWY1ODE3Yzc1Mjcx`);
        node.appendChild(script);

        // console.log('getDomainRes', response);
        // // TODO do dynamically
        // script.setAttribute('src', `https://api.facet.ninja/facet.ninja.js?id=${response.id}`);
        // node.appendChild(script);
    })

}
injectScript(chrome.extension.getURL('facet-extension-window-variable-content.js'), 'body');
