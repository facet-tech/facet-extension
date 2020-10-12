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
        const res = await fetch(url, obj);
        const resjson = await res.json();
        console.log('[API] result:', resjson);
        return resjson;
    } catch (e) {
        console.log('[API][Error]', e)
    }
}

const createNewUser = (email, workspaceId) => {
    const body = {
        email,
        workspaceId
    }
    const suffix = '/user';
    return triggerApiCall(HTTPMethods.POST, suffix, body);
}

const deleteUser = async (email, workspaceId) => {
    const body = {
        email,
        workspaceId
    }
    let url = 'https://api.facet.ninja/user';
    let options = {
        method: 'DELETE'
    };

    options.body = JSON.stringify(body);
    let deleteResponse = await fetch(url, options);
    const jsonResponse = deleteResponse.json();
    return jsonResponse;
}

const createDomain = async (domain, workspaceId) => {
    const body = {
        domain,
        workspaceId
    };
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

const getOrPostDomain = async (workspaceId) => {

    let domainRes = await getDomain(window.location.hostname, workspaceId);
    const domainExists = domainRes && domainRes.id !== undefined;

    // create domain if it doesn't exist
    if (domainExists) {
        return domainRes;
    }
    domainRes = await createDomain(window.location.hostname, workspaceId);
    return domainRes;
}

const getOrCreateWorkspace = async (email) => {
    //https://api.facet.ninja/user?email=hello@gmail.com
    let suffix = `/user?email=${email}`;
    const getUser = await triggerApiCall(HTTPMethods.GET, suffix);
    if (getUser) {
        const workspaceSuffix = `/workspace?id=${getUser.workspaceId}`;
        let workspaceResponse = await triggerApiCall(HTTPMethods.GET, workspaceSuffix)
        return workspaceResponse;
    }
    const body = {
        domain: window.location.hostname,
    }
    const workspaceResponse = await triggerApiCall('POST', '/workspace', body);
    let newUserResponse = await createNewUser(email, workspaceResponse.id);
    return workspaceResponse;
}

const getFacet = async (domainId, urlPath) => {
    const suffix = `/facet?domainId=${domainId}&urlPath=${urlPath}`;
    const apiResponse = await triggerApiCall(HTTPMethods.GET, suffix);
    return apiResponse;
}

// TODO browser issues fix
const deleteFacet = async (body) => {

    let url = 'https://api.facet.ninja/facet';
    let options = {
        method: 'DELETE'
    };

    options.body = JSON.stringify(body);
    let deleteResponse = await fetch(url, options);
    const jsonResponse = deleteResponse.json();
    return jsonResponse;
}

export {
    constructPayload, triggerApiCall, createDomain,
    getDomain, getFacet, getOrPostDomain, deleteFacet,
    getOrCreateWorkspace, deleteUser, createNewUser
};