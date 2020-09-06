/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import AppProvider from './AppProvider';
import { SnackbarProvider } from "notistack";
import Popup from './Popup';

const displayingElement = document.getElementById('popup') ? <Popup /> : <App />;
let displayId = document.getElementById('popup') ? 'popup' : 'facetizer';

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

// Render the <App /> component.
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
                    {displayingElement}
                </AppProvider>
            </SnackbarProvider>
        </div>
    </React.StrictMode>,
    document.getElementById(displayId)
);



registerServiceWorker();
