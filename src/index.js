/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import AppProvider from './AppProvider';
import { SnackbarProvider } from "notistack";
import Popup from './popup/Popup';
import { Auth0Provider } from '@auth0/auth0-react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

if (!document.getElementById('popup')) {

    // Get the element to prepend our app to. This could be any element on a specific website or even just `document.body`.
    const body = document.body;

    // Create a div to render the <App /> component to.
    const facetDiv = document.createElement('div');

    // Set the app element's id to `root`. This is the same as the element that create-react-app renders to by default so it will work on the local server too.
    facetDiv.id = 'facetizer';

    // Prepend the <App /> component to the viewport element if it exists. You could also use `appendChild` depending on your needs.
    if (body) body.prepend(facetDiv);
}

if (document.getElementById('facetizer')) {

    ReactDOM.render(
        <React.StrictMode>
            <div id='facet-sidebar'>
                <SnackbarProvider maxSnack={4}
                    disableWindowBlurListener
                    autoHideDuration={5000}
                    iconVariant={{
                        success: '🐱‍👤',
                        error: '✖️',
                        warning: '⚠️',
                        info: 'ℹ️',
                    }}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}>
                    <AppProvider>
                        <App />
                    </AppProvider>
                </SnackbarProvider>
            </div>
        </React.StrictMode>,
        document.getElementById('facetizer')
    );
}


if (document.getElementById('popup')) {
    ReactDOM.render(
        <React.StrictMode>
            <Auth0Provider
                domain="dev-rp2pqit4.auth0.com"
                clientId="mwufYehukQrNlt6URsO5sR8k9JExgfP1"
                redirectUri="http://localhost:3000/callback"
            >
                <div id='popup-container'>
                    <Popup />
                </div>
            </Auth0Provider>
        </React.StrictMode>,
        document.getElementById('popup')
    );
}

registerServiceWorker();
