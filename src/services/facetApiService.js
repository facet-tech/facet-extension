import { HTTPMethods, APIUrl } from "../shared/constant";

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
        const url = `${APIUrl.testBaseURL}${urlSuffix}`;
        let obj = HTTPMethods.GET === method ? { method } : { method, body: JSON.stringify(body) };
        const res = await fetch(url, obj);
        const resjson = await res.json();
        const result = {
            response: resjson,
            status: res.status
        };
        console.log('[API] result:', result);
        return result;
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
    let url = `${APIUrl.testBaseURL}/user`;
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

const getDomain = async (domainName, workspaceId) => {
    const suffix = `/domain?domain=${domainName}&workspaceId=${workspaceId}`;
    const apiResponse = await triggerApiCall(HTTPMethods.GET, suffix);
    return apiResponse;
}

const getOrPostDomain = async (workspaceId) => {
    try {
        let domainRes = await getDomain(window.location.hostname, workspaceId);
        const domainExists = domainRes && domainRes.response.id !== undefined;
        // create domain if it doesn't exist
        if (domainExists) {
            return domainRes;
        }
        domainRes = await createDomain(window.location.hostname, workspaceId);
        return domainRes;
    } catch (e) {
        console.log(`[ERROR] [getOrPostDomain] `, e);
    }
}

const getOrCreateWorkspace = async (email) => {
    try {
        let suffix = `/user?email=${email}`;
        const getUserResponse = await triggerApiCall(HTTPMethods.GET, suffix);
        // create new user
        if (getUserResponse && getUserResponse.status >= 400 && getUserResponse.status <= 500) {
            // post workspace
            const createWorkspaceResponse = await triggerApiCall(HTTPMethods.POST, '/workspace');
            // post user
            let createUserBody = {
                email,
                workspaceId: createWorkspaceResponse.response.id
            }
            await triggerApiCall(HTTPMethods.POST, '/user', createUserBody);
            return createWorkspaceResponse;
        }
        // user exists
        return getUserResponse.response;
    } catch (e) {
        console.log('[error] getOrCreateWorkspace', e);
    }
}

const getFacet = async (domainId, urlPath) => {
    const suffix = `/facet?domainId=${domainId}&urlPath=${urlPath}`;
    const apiResponse = await triggerApiCall(HTTPMethods.GET, suffix);
    return apiResponse;
}

// TODO browser issues fix
const deleteFacet = async (body) => {

    let url = `${APIUrl.testBaseURL}/facet`;
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