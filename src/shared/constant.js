import isDevelopment from "../utils/isDevelopment";

const facetizerId = 'facetizer';
const facetKey = 'facet-settings'
const isPluginEnabled = 'isPluginEnabled';
const isUserAuthenticated = 'isUserAuthenticated';
const apiBaseURL = 'https://api.facet.ninja';
const testBaseURL = 'https://test.api.facet.ninja';
const localBaseURL = 'http://localhost:3000';
const defaultFacet = 'Facet-1';

const authState = {
    notSignedIn: 'NOT_LOGGED_IN',
    signedIn: 'LOGGED_IN',
    signingIn: 'SIGNING_IN',
    signUp: 'SIGN_UP',
    signingUp: 'SIGNING_UP',
    confirmingSignup: 'CONFIRMING_SIGNUP',
};

// information persisted in sync.storage
const authStorage = {
    username: 'USERNAME',
    sessionToken: 'SESSION_TOKEN'
};

const styles = {
    drawerWidth: 280
}

const APIUrl = {
    apiBaseURL,
    testBaseURL,
    localBaseURL,
    activeBaseURL: isDevelopment() ? localBaseURL : apiBaseURL
};

const LoginTypes = {
    email: 'email',
    workspaceId: 'workspaceId'
};

const storage = {
    isPluginEnabled,
    isUserAuthenticated,
    username: 'username',
    password: 'password'
};

const ChromeRequestType = {
    GET_LOGGED_IN_USER: 'GET_LOGGED_IN_USER'
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
    facetizerId, facetKey, isPluginEnabled,
    storage, LoginTypes, api, HTTPMethods,
    APIUrl, defaultFacet, styles, authState,
    authStorage, ChromeRequestType
};
