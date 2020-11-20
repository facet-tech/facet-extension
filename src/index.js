/*global chrome*/

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AppProvider from './AppProvider';
import { SnackbarProvider } from "notistack";
import Popup from './popup/Popup';
import PopupProvider from './popup/PopupProvider';
import CoreProvider from './CoreProvider';
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import { styles } from './shared/constant';
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

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

    const body = document.body;

    const facetDiv = document.createElement('div');
    facetDiv.setAttribute("style", `width: ${styles.drawerWidth}px !important`)
    facetDiv.id = 'facetizer';
    if (body) {
        body.prepend(facetDiv);
    }
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
                    <div id='popup-container'>dwdwwd
                        <Popup />
                    </div>
                </PopupProvider>
            </SnackbarProvider>
        </React.StrictMode>,
        document.getElementById('popup')
    );
}