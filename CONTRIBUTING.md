# Thank you for contributing to facet-extension!

## Start the project

### Build

### Install dependencies

```
yarn install
```

### Start

```
yarn start
```

### Build

```
yarn build
```

### See changes in chrome:

2. `yarn build`
3. Click the reload button next to the facet.ninja plugin and you are settled.

![Facetizer](./readme_assets/chrome_installation.png)

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


## Authentication

Hosted UI Endpoint: https://facetextensionfd235e0e-fd235e0e-dev.auth.us-west-2.amazoncognito.com/
Test Your Hosted UI Endpoint: https://facetextensionfd235e0e-fd235e0e-dev.auth.us-west-2.amazoncognito.com/login?response_type=code&client_id=6fa4fhctnojuf3hmlvo0mvsp02&redirect_uri=http://localhost:3000/