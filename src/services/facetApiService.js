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
        const resjson = await res.json();
        console.log('[API] result:', resjson);
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
    return apiResponse;
}

//http://localhost:3000/domain?domain=pornhub.com&workspaceId=NWVhMDExM2YtZjBmZi00NzIyLWIzYjctNjZlYzdiMjk1Nzc3
const getDomain = async (domainName, workspaceId) => {
    const suffix = `/domain?domain=${domainName}&workspaceId=${workspaceId}`;
    const apiResponse = await triggerApiCall(HTTPMethods.GET, suffix);
    return apiResponse;
}

export { constructPayload, triggerApiCall, createDomain, getDomain };