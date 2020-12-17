# Facet

### The fastest way to rollout features without using developer resources.

<br/>
Facet enables product teams to rollout features without declaring in-code logic.

## Declaring a facet

A facet is a set elements that make up a feature. For instance, a login form could be considered a facet, with the elements being `username` and `password`.
(//todo image)

Creating/Reading/Updating/Deleting (CRUD) frontend facets is achieved through the facet chrome extension. After you install the extension from the Chrome Web Store, you can login into the platform.

Navigate to the application where you want to create facets and enable the plugin through the popup.
(//todo image)

A sidebar will be loaded on the left, which will offer the ability of CRUD-ing facets. The facet extension is enabled buy clicking the first button on the top navigation bar.

Declaring a facet is as easy as clicking on the element of interest, as shown below:
(//todo image)

## Holding off and rolling out facets

By clicking on the display/hide icon next to each facet, you can rollout facets in production.
Once your configuration is ready, save your changes and your configuration will be applied into your application.

## One-line code integration

Last but not least, copy the snippet of code generated from the facet-extension.
(//todo image)

This will give you the single line that you need to paste into your `<head>` HTML code. The line looks like this:
`<script src="https://api.facet.ninja/facet.ninja.js?id={ID}"></script>`

The ID refers to the ID of your website. Once this line of code is integrated in your system, you will be able to see the configurations applied from the facet extension.
