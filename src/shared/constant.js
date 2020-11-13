import isDevelopment from "../utils/isDevelopment";

const facetizerId = 'facetizer';
const facetKey = 'facet-settings'
const showFacetizer = 'showFacetizer';
const isPluginEnabled = 'isPluginEnabled';
const isUserAuthenticated = 'isUserAuthenticated';
const apiBaseURL = 'https://api.facet.ninja';
const testBaseURL = 'https://test.api.facet.ninja';
const localBaseURL = 'http://localhost:3000';

const APIUrl = {
    apiBaseURL,
    testBaseURL,
    localBaseURL,
    activeBaseURL: isDevelopment() ? localBaseURL : apiBaseURL
}

const LoginTypes = {
    email: 'email',
    workspaceId: 'workspaceId'
}

const storage = {
    showFacetizer,
    isPluginEnabled,
    isUserAuthenticated,
};

const api = {
    domainId: 'domainId',
    workspace: {
        workspaceId: 'workspaceId'
    },
    facetObjectVersion: '0.0.1'// TODO ideally this matches the manifest version
};

const HTTPMethods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
};

export {
    facetizerId, facetKey, showFacetizer,
    isPluginEnabled, storage, LoginTypes,
    api, HTTPMethods, APIUrl
};
