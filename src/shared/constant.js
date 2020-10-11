const facetizerId = 'facetizer';
const facetKey = 'facet-settings'
const showFacetizer = 'showFacetizer';
const isPluginEnabled = 'isPluginEnabled';
const isUserAuthenticated = 'isUserAuthenticated';

const LoginTypes = {
    email: 'email',
    workspaceId: 'workspaceId'
}

const storage = {
    showFacetizer,
    isPluginEnabled,
    isUserAuthenticated
};

const api = {
    userId: 'userId',
    workspace: {
        workspaceId: 'workspaceId'
    }
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
    api, HTTPMethods
};
