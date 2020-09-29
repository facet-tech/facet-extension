## Demo:

https://video.facet.ninja/vision

# Facetizer Chrome extension

Control your release 🚀 lifecycle and embrace trunk based development with ⚔️ facet.ninja ⚔️

## Installation

- Fork or clone `git@github.com:facets-io/facet-extension.git`
- `yarn run install`
- `yarn run build`
- Navigate to `chrome://extensions`
- Check the _Developer mode_ checkbox
- Click _Load unpacked extension..._
- Find and select the `build` folder
- Navigate to your website (e.g.,: `https://www.google.com`)
- Select the elements which you want to display and/or hide.
- Click Save
- Inject script into your server (`require(facet.ninja)`)
- Deploy and see results in production

## See changes in chrome:

2. `yarn build`
3. Click the reload button next to the facet.ninja plugin and you are settled.

![Facetizer](./readme_assets/chrome_installation.png)
