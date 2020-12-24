import { HTTPMethods, APIUrl, storage, snackbar, isPluginEnabled } from "../shared/constant";
import { getKeyFromLocalStorage, setKeyInLocalStorage } from '../shared/loadLocalStorage';
import { api, LoginTypes } from '../shared/constant';
import MockService from './MockService'
import isDevelopment from "../utils/isDevelopment";
import parsePath from "../shared/parsePath";
import AmplifyService from "./AmplifyService";
import triggerDOMReload from "../shared/popup/triggerDOMReload";

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
        let headers = {
            AccessToken: jwt,
        };
        const url = `${APIUrl.activeBaseURL}${urlSuffix}`;
        let obj = HTTPMethods.GET === method ? { method, headers } : { headers, method, body: JSON.stringify(body) };
        const res = await fetch(url, obj);
        if (!res) {
            return {
                response: undefined,
                status: 404
            };
        }
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

const postUser = async ({ email, id, workspaceId, whitelistedDomain }) => {
    const body = {
        id,
        email,
        workspaceId,
        attribute: {
            whitelistedDomain
        }
    }
    const suffix = '/user';
    return triggerApiCall(HTTPMethods.POST, suffix, body);
}

const userExists = async ({ email, workspaceId }) => {
    let suffix = `/user?email=${email}`;
    const getUserResponse = await triggerApiCall(HTTPMethods.GET, suffix);
    if (getUserResponse && getUserResponse.status >= 400 && getUserResponse.status <= 500) {
        return false;
    }
    return getUserResponse;
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

const getDomain = async (domainName, workspaceId, readFromStorage = true) => {
    if (process.env.NODE_ENV === 'development') {
        return MockService.mockGetDomain();
    }
    if (readFromStorage) {
        const { domainId } = await getKeyFromLocalStorage(storage.sessionData) || {};
        if (domainId) {
            const responseObject = {
                response: {
                    id: domainId
                }
            };
            return responseObject;
        }
    }
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

const getUser = async () => {
    const email = await getKeyFromLocalStorage(storage.username);
    const { workspaceId } = await getKeyFromLocalStorage(storage.sessionData);

    let suffix = `/user?email=${email}`;
    const getUserResponse = await triggerApiCall(HTTPMethods.GET, suffix);

    return getUserResponse;
};

const hasWhitelistedDomain = async (domain) => {
    const getUserResponse = await getUser();
    const { whitelistedDomain } = getUserResponse?.response?.attribute || [];
    return whitelistedDomain?.includes(domain);
}

const addWhiteListedDomain = async (domain) => {
    const userResponse = await getUser();
    let whitelistedDomain;
    if (!userResponse) {
        whitelistedDomain = [domain]
    } else {
        const currWhitelistedDomains = userResponse?.response?.attribute?.whitelistedDomain || [];
        let uniqDomainSet = new Set([...currWhitelistedDomains, domain]);
        whitelistedDomain = [...uniqDomainSet];
    }
    const email = await getKeyFromLocalStorage(storage.username);
    const { workspaceId } = await getKeyFromLocalStorage(storage.sessionData);

    await postUser({
        email, workspaceId, id: userResponse?.response?.id, whitelistedDomain
    });
    setKeyInLocalStorage(isPluginEnabled, true);
    triggerDOMReload();
};

const removeWhitelistedDomain = async (domain) => {
    const getUserResponse = await getUser();
    const { whitelistedDomain } = getUserResponse?.response?.attribute || [];
    const newArr = whitelistedDomain.filter(e => e !== domain);
    const email = await getKeyFromLocalStorage(storage.username);
    const { workspaceId } = await getKeyFromLocalStorage(storage.sessionData);

    await postUser({
        email, workspaceId, id: getUserResponse?.response?.id, whitelistedDomain: newArr
    });
}

const getOrCreateWorkspace = async (email, readFromStorage = true) => {
    try {
        let suffix = `/user?email=${email}`;
        if (readFromStorage) {
            const { workspaceId } = await getKeyFromLocalStorage(storage.sessionData) || {};
            if (workspaceId) {
                const responseObject = {
                    response: {
                        id: workspaceId
                    }
                };
                return responseObject;
            }
        }
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
const convertDOMElement = (facet) => {
    return (facet?.domElement?.map(domElement => {
        return {
            ...domElement,
            withoutFacetizer: true
        }
    })) || [];
}

const convertGetFacetResponseToMap = (responseBody) => {
    let facetMap = new Map();
    responseBody && responseBody.facet && responseBody.facet.forEach(facet => {
        const element = convertDOMElement(facet)
        element.enabled = facet.enabled;
        facetMap.set(facet.name, element || [])
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

const extractFacetArray = (facetMap, nonRolledOutFacets) => {
    try {
        const facetArray = Array.from(facetMap, ([name, value]) => ({ name, value }));
        return facetArray.map(facet => {
            return {
                enabled: nonRolledOutFacets.includes(facet.name),
                name: facet.name,
                domElement: generateDomElements(facetMap.get(facet.name))
            }
        });
    } catch (e) {
        console.log(`[ERROR] [extractFacetArray]`, e)
    }
}

const generateRequestBodyFromFacetMap = (facetMap, nonRolledOutFacets, domainId) => {
    const facetObjectVersion = api.facetObjectVersion;
    const body = {
        domainId,
        urlPath: window.location.pathname,
        facet: extractFacetArray(facetMap, nonRolledOutFacets),
        version: facetObjectVersion,
    }
    return body;
}

const saveFacets = async (facetMap, nonRolledOutFacets, enqueueSnackbar) => {
    try {
        // check if domain exists
        const workspaceId = await getKeyFromLocalStorage(api.workspace.workspaceId);
        let getDomainRes = await getOrPostDomain(workspaceId);
        const body = generateRequestBodyFromFacetMap(facetMap, nonRolledOutFacets, getDomainRes.response.id);
        await triggerApiCall(HTTPMethods.POST, '/facet', body);
        enqueueSnackbar({
            message: `Hooray ~ Configuration has been saved!`,
            variant: "success"
        });
    } catch (e) {
        enqueueSnackbar({
            message: `Apologies, something went wrong. Please try again later.`,
            variant: snackbar.error.text
        });
        console.log(`[ERROR] [onSaveClick] `, e)
    }
}

export {
    constructPayload, triggerApiCall, createDomain,
    getDomain, getFacet, getOrPostDomain, deleteFacet,
    getOrCreateWorkspace, deleteUser, postUser,
    saveFacets, convertGetFacetResponseToMap, addWhiteListedDomain,
    hasWhitelistedDomain, removeWhitelistedDomain
};