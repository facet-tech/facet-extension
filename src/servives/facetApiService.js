const constructPayload = (site = '', urlPath = '', path = []) => {

    return {
        domElements: [
            {
                enabled: true,
                path,
            },
            site,
            urlPath
        ]
    }
};

/**
 * @param {method} 'POST' | 'GET' | 'PUT' | PATCH' and so on.
 * @param {urlSuffix} urlSuffix default empty value = ''
 * @param {body} body the body of the request
 */
const triggerApiCall = (method, urlSuffix = '', body) => {
    const url = `https://api.facet.ninja/facet${urlSuffix}`;
    return fetch(url, {
        method,
        body
    })
}

export { constructPayload, triggerApiCall };