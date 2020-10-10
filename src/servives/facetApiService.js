import { HTTPMethods } from "../shared/constant";

/**
 * @param {domainId}
 * @param {urlPath} urlSuffix default empty value = ''
 * @param {body} body the body of the request
 */
const constructPayload = (domainId = '', urlPath = '', path = []) => {

    return {
        domainId,
        domElements: [
            {
                enabled: true,
                path,
            },
            urlPath
        ]
    }
};

/**
 * @param {method} 'POST' | 'GET' | 'PUT' | PATCH' and so on.
 * @param {urlSuffix} urlSuffix default empty value = ''
 * @param {body} body the body of the request
 */
const triggerApiCall = async (method, urlSuffix = '', body) => {
    try {
        const url = `https://api.facet.ninja${urlSuffix}`;
        let obj = HTTPMethods.GET === method ? { method } : { method, body: JSON.stringify(body) };
        console.log('[API] triggering call', url, obj);
        const res = await fetch(url, obj);
        console.log('res!', res);
        const resjson = await res.json();
        console.log('resjson', resjson);
        return resjson;
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

const createDomain = async (domain, workspaceId) => {
    const body = {
        domain,
        workspaceId
    };
    console.log('body', body);
    const suffix = '/domain';
    const apiResponse = await triggerApiCall(HTTPMethods.POST, suffix, body);
    console.log('apirespose', apiResponse);
    return apiResponse.json();
}

export { constructPayload, triggerApiCall, createDomain };