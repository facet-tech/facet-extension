# Facet

### The quickest way to rollout features without engaging engineering resources.

<br/>
Facet enables product teams to rollout features, without having to declare in-code logic.

## Declaring a facet

A facet is a set elements that construe a feature. For instance, a login form could be considered a facet, with the elements being `username` and `password`.

Creating/Reading/Updating/Deleting (CRUD) facets is achieved by using the facet chrome extension. After you install the extension from the Chrome Web Store, you can login into the platform.

Navigate to the application where you want to create facets, and enable the plugin through the popup.

A sidebar will be loaded on the left side, which will offer the ability of CRUD-ing facets. The facet-extension can be enabled through the very first button on the top navigation bar.

Declaring a facet is as easy as clicking on the element of interest, as shown below:

## Holding off and rolling out facets

By clicking on the display/hide icon next to each facet, you are able to rollout facets in production.
Once your configuration is ready, save your changes and your configuration will be applied into your application.


## One-line of code integration

Last but not least, copy the snippet of code generated from the facet-extension. This will give you the single line that you need to paste into your `<head>` HTML code. The line looks like this:
`<script src="https://api.facet.ninja/facet.ninja.js?id={ID}"></script>`

The ID refers to the ID of your website. Once this line of code is integrated in your system, you should be able to see the configurations applied from the facet extension.