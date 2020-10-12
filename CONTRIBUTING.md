# Thank you for contributing to facet-extension!

## Tests

Run tests with `yarn test`.

## Semantic Versioning (SemVer) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://semver.org/)

[Semantic Versioning](https://semver.org/) is utilized as means to versioning.

## Storage

Read values from local storage:

```
 chrome.storage && chrome.storage.sync.get('facet-settings', function (obj) {
        console.log('[local storage]:', obj);
 });
```

Clean local storage:

```
chrome.storage.sync.clear(function () {
    var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    }
});
```
