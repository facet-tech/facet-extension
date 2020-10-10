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

const getOrPostDomain = async (domainName, workspaceId) => {

    let domainRes = await getDomain(window.location.hostname, workspaceId);
    const domainExists = domainRes && domainRes.id !== undefined;

    // create domain if it doesn't exist
    if (domainExists) {
        return domainRes;
    }
    domainRes = await createDomain(window.location.hostname, workspaceId);
    return domainRes;
}

const getFacet = async (domainId, urlPath) => {
    const suffix = `/facet?domainId=${domainId}&urlPath=${urlPath}`;
    const apiResponse = await triggerApiCall(HTTPMethods.GET, suffix);
    return apiResponse;
}

// TODO browser issues fix
const deleteFacet = async (body) => {
    const url = 'https://api.facet.ninja/facet'
    const deleteMethod = {
        method: 'DELETE', // Method itself
        body: JSON.stringify({
            "domainId": "YzU2NmUxYTktZGIwZC00Y2Y1LTlmYTMtMWI5YTdlODIyNTRj", "domElement": [], "urlPath": "/"
        }) // We send data in JSON format
    };

    const res = await fetch(url, deleteMethod);
    const res1 = await res.json();

    return res1;
}

export { constructPayload, triggerApiCall, createDomain, getDomain, getFacet, getOrPostDomain, deleteFacet };