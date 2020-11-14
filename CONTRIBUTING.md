# Thank you for contributing to facet-extension!

## Code of Conduct

Facet ninja has adopted the [Contributor Covenant](https://www.contributor-covenant.org/) as its Code of Conduct, and we expect project participants to adhere to it.
Please read [the full text](/CODE_OF_CONDUCT.md).

## Tests

Run tests with `yarn test`.

## Semantic Versioning (SemVer) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://semver.org/)

[Semantic Versioning](https://semver.org/) is utilized as means to versioning.

## Google Storage API

This is where the facet-extension reads values from. Here are some examples of how to CRUD it:

#### Read values from local storage:

```
chrome.storage && chrome.storage.sync.get('facet-settings', function (obj) {
    console.log('[local storage]:', obj);
});
```

#### Set values in local storage:

```
chrome.storage && chrome.storage.sync.get('facet-settings', function (obj) {
    console.log('[local storage]:', obj);
    const aboutToSet = {
        "facet-settings": {
            ...obj,
            enabled: true
        }
    };

    chrome.storage && chrome.storage.sync.set(aboutToSet, async function () {
        console.log(`[STORAGE] updated`);
    });
});
```

#### Clean local storage:

```
chrome.storage.sync.clear(function () {
    var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    }
});
```
