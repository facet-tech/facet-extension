import { HTTPMethods, APIUrl } from "../shared/constant";
import { getKeyFromLocalStorage } from '../shared/loadLocalStorage';
import { api } from '../shared/constant';
import MockService from './MockService'
import isDevelopment from "../utils/isDevelopment";
import parsePath from "../shared/parsePath";
import AmplifyService from "./AmplifyService";

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
        let jwt = await AmplifyService.getCurrentUserJTW();
        console.log('JWT',jwt);
        let headers = {
            AccessToken: jwt,
        };
        const url = `${APIUrl.activeBaseURL}${urlSuffix}`;
        let obj = HTTPMethods.GET === method ? { method, headers } : { headers, method, body: JSON.stringify(body) };
        const res = await fetch(url, obj);
        const response = await res.json();
        const result = {
            response,
            status: res.status
        };
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
    let url = `${APIUrl.activeBaseURL}/user`;
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
    console.log('@getDomain',domainName);
    if (process.env.NODE_ENV === 'development') {
        return MockService.mockGetDomain();
    }
    const suffix = `/domain?domain=${domainName}&workspaceId=${workspaceId}`;
    const apiResponse = await triggerApiCall(HTTPMethods.GET, suffix);
    return apiResponse;
}

const getOrPostDomain = async (workspaceId) => {
    console.log('@GETORPOSTDOMAIN',window.location);
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
        return getUserResponse;
    } catch (e) {
        console.log('[error] getOrCreateWorkspace', e);
    }
}

const getFacet = async (domainId, urlPath) => {
    if (isDevelopment()) {
        return MockService.mockGetFacet();
    }
    const suffix = `/facet?domainId=${domainId}&urlPath=${urlPath}`;
    const apiResponse = await triggerApiCall(HTTPMethods.GET, suffix);
    return apiResponse;
}

/**
 * @param {*} domElementArr domElement array
 */
const convertDOMElement = (domElementArr) => {
    return (domElementArr && domElementArr.map(domElement => {
        return {
            ...domElement,
            withoutFacetizer: true
        }
    })) || [];
}

const convertGetFacetResponseToMap = (responseBody) => {
    let facetMap = new Map();
    responseBody && responseBody.facet && responseBody.facet.forEach(facet => {
        const transformedDomElement = convertDOMElement(facet.domElement)
        facetMap.set(facet.name, transformedDomElement || [])
    })
    return facetMap;
}

// TODO browser issues fix
const deleteFacet = async (body) => {

    let url = `${APIUrl.activeBaseURL}/facet`;
    let options = {
        method: 'DELETE'
    };

    options.body = JSON.stringify(body);
    let deleteResponse = await fetch(url, options);
    const jsonResponse = deleteResponse.json();
    return jsonResponse;
}

const generateDomElements = (domElements) => {
    const result = (domElements && domElements.map(domElement => {
        return {
            name: domElement.name,
            path: domElement.withoutFacetizer ? domElement.path : parsePath([domElement.path], true)[0]
        }
    })) || [];
    return result;
}

const extractFacetArray = (facetMap) => {
    try {
        const facetArray = Array.from(facetMap, ([name, value]) => ({ name, value }));

        return facetArray.map(facet => {
            return {
                enabled: false,
                name: facet.name,
                domElement: generateDomElements(facetMap.get(facet.name))
            }
        });
    } catch (e) {
        console.log(`[ERROR] [extractFacetArray]`, e)
    }
}

const generateRequestBodyFromFacetMap = (facetMap, domainId) => {
    const facetObjectVersion = api.facetObjectVersion;
    const body = {
        domainId,
        urlPath: window.location.pathname,
        facet: extractFacetArray(facetMap),
        version: facetObjectVersion,
    }
    return body;
}

const saveFacets = async (facetMap, enqueueSnackbar) => {
    try {
        // check if domain exists
        const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
        let getDomainRes = await getOrPostDomain(workspaceId);
        const body = generateRequestBodyFromFacetMap(facetMap, getDomainRes.response.id);
        await triggerApiCall(HTTPMethods.POST, '/facet', body);
        enqueueSnackbar(`Hooray ~ Configuration has been saved 🙌!`, { variant: "success" });
    } catch (e) {
        enqueueSnackbar(`Apologies, something went wrong. Please try again later.`, { variant: "error" });
        console.log(`[ERROR] [onSaveClick] `, e)
    }
}

export {
    constructPayload, triggerApiCall, createDomain,
    getDomain, getFacet, getOrPostDomain, deleteFacet,
    getOrCreateWorkspace, deleteUser, createNewUser,
    saveFacets, convertGetFacetResponseToMap
};