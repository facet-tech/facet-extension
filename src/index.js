/*global chrome*/

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import AppProvider from './AppProvider';
import { SnackbarProvider } from "notistack";
import Popup from './popup/Popup';
import PopupProvider from './popup/PopupProvider'

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
                        error: '✖️',
                        warning: '⚠️',
                    }}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}>
                    <AppProvider>
                        <App />
                    </AppProvider>
                </SnackbarProvider>
            </div >
        </React.StrictMode >,
        document.getElementById('facetizer')
    );
}

// chrome.storage && chrome.storage.sync.set({ 'facet-settings': {} }, async function () {
//     console.log('fresh')
// });

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

registerServiceWorker();
