import { HTTPMethods } from "../shared/constant";

/**
 * @param {siteId}
 * @param {urlPath} urlSuffix default empty value = ''
 * @param {body} body the body of the request
 */
const constructPayload = (siteId = '', urlPath = '', path = []) => {

    return {
        domElements: [
            {
                enabled: true,
                path,
            },
            siteId,
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
    try {
        const url = `https://api.facet.ninja${urlSuffix}`;
        let obj = HTTPMethods.GET === method ? { method } : { method, body };
        console.log('[API] triggering call', url, obj);
        const res = fetch(url, obj);
        console.log('res!',res);
        return res;
    } catch (e) {
        console.log('[triggerApiCall]', e)
    }
}

const createNewUser = (email) => {
    const body = {
        email
    }
    const suffix = '/user';
    return triggerApiCall(HTTPMethods.POST, suffix, body);

}

export { constructPayload, triggerApiCall };