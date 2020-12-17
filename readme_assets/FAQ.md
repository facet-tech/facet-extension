# FAQ

1. Why Facet?<br/>
   Facet abstracts the rollout mechanism that used to be achieved by using feature flags. At facet, we believe that engineers shouldn't spend their time maintaining manual configurations that come along with feature flags. We enable engineers to focus on building the future, while we build the rollout abstractions to support them throughout the journey.

2. What is a facet? <br/>
   A facet is a set elements that construe a feature. For instance, a login form could be considered a facet, with the elements being `username` and `password`.
   (//todo add image)

3. Is JS/HTML code delivered at all after disabling a facet?<br/>
   JS code is delivered all the times to the end user. The facet CDN script observes facets and hides them from the website, but code is still being delivered to the website.

4. My facet is declared in multiple pages (ie: menu). Can I declare a global facets?<br/>
   Not yet. coming soon!

5. How to hide a facet before rolling out to production?<br/>
   Not yet. coming soon!

6. Can I declare facets within backend technologies? <br/>
   Not yet. Our team is working hard to offer facet declaration for backend systems. We will be soon launching a pilot, initially we are targeting Java as the piloting language. However, we are planning to open source the underlying API, so that affiliating SDKs can be implemented in whichever language of interest.

7. Is facet secure? <br/>
   At facet, Security is one of the main pillars of our culture. We have integrated with multiple vendors who champion DevSecOps, including [Snyk](https://snyk.io/) and [Github](https://github.com/dependabot), to ensure secure codebases. We are also working on getting ISO, HIIPA and other security compliance license.

8. Is facet open source? <br/>
   Currently, facet-extension is open source. We believe in open source and we plan to open source many of our systems as they become mature and ready for the public.

9. How to contact? <br/>
   You can open github issue or email us at support@facet.run.
