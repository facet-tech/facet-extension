# FAQ

1. What is a facet? <br/>
   A facet is a set elements that construe a feature. For instance, a login form could be considered a facet, with the elements being `username` and `password`.
   (//todo add image)

2. Why Facet?<br/>
   Facet abstracts the rollout process that is commonly achieved by using feature flags. At facet, we believe that engineers shouldn't spend their time maintaining manual configurations like the ones feature flags require. We enable engineers to focus on building their product, while we build the rollout abstractions to support them throughout the journey.
   
3. Is JS/HTML code delivered at all after disabling a facet?<br/>
   JS code is delivered at all times to the end user. The facet CDN script observes facets and hides them from the website, but code is still being delivered to the website.

4. My facet is declared in multiple pages (ie: menu). Can I declare a global facets?<br/>
   Not yet. Coming soon!

5. How can I hide a facet before rolling out to production?<br/>
   Not yet. coming soon!

6. Can I declare facets within backend technologies? <br/>
   Not yet. Our team is working hard to offer facet declaration for backend systems. We will be launching a pilot soon, targeting Java as the piloting language. However, we are planning mzkd the underlying API open source, so that affiliating SDKs can be implemented in whichever language of interest.

7. Is using facets secure? <br/>
   At facet, Security is at the center of our priorities. We have integrated with multiple vendors who champion DevSecOps,including [Snyk](https://snyk.io/) and [Github](https://github.com/dependabot), to ensure secure codebases. We are also working on getting ISO, HIIPA and other security compliance licenses.

8. Is facet open source? <br/>
   Currently, facet-extension is open source. We believe in open source and we plan to make many of our systems open source as they become ready for release.

9. How can I contact you? <br/>
   You can open a github issue or email us at support@facet.run.
