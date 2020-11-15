/*global chrome*/

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AppProvider from './AppProvider';
import { SnackbarProvider } from "notistack";
import Popup from './popup/Popup';
import PopupProvider from './popup/PopupProvider';
import CoreProvider from './CoreProvider';
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import $ from 'jquery';
import { styles } from './shared/constant';

if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
        dsn: 'https://1060dd3ea4384475b0e957d971fa376b@o460218.ingest.sentry.io/5460107',
        integrations: [
            new Integrations.BrowserTracing(),
        ],
        // We recommend adjusting this value in production, or using tracesSampler
        // for finer control
        tracesSampleRate: 1.0,
    });
}

if (!document.getElementById('popup')) {

    $('body').attr('style', function (i, s) {
        return (s || '') + `position: absolute !important;left: ${styles.drawerWidth}px !important;right: 0px !important;min-height: calc(100% - 96px) !important;overflow-x: initial !important;`;
    });

    // top: 96px !important;
    // position: absolute !important;
    // left: 0px !important;
    // right: 0px !important;
    // min-height: calc(100% - 96px) !important;
    // overflow-x: initial !important;

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
                        error: '✖️',
                        warning: '⚠️',
                    }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}>
                    <AppProvider>
                        <CoreProvider>
                            <App />
                        </CoreProvider>
                    </AppProvider>
                </SnackbarProvider>
            </div >
        </React.StrictMode >,
        document.getElementById('facetizer')
    );
}

// TODO fix duplication
if (document.getElementById('popup')) {
    ReactDOM.render(
        <React.StrictMode>
            <SnackbarProvider maxSnack={4}
                disableWindowBlurListener
                autoHideDuration={5000}
                iconVariant={{
                    error: '✖️',
                    warning: '⚠️',
                }}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}>
                <PopupProvider>
                    <div id='popup-container'>
                        <Popup />
                    </div>
                </PopupProvider>
            </SnackbarProvider>
        </React.StrictMode>,
        document.getElementById('popup')
    );
}