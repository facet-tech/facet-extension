/* global chrome */

import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';
import Amplify from 'aws-amplify';
import App from './App';
import AppProvider from './AppProvider';
import CoreProvider from './CoreProvider';
import { styles, domIds, isActivelyBeingDebugged, ChromeRequestType } from './shared/constant';
import awsExports from './aws-exports';
import Popup from './popup/Popup';
import PopupProvider from './popup/PopupProvider';
import SigninPopup from './popup/SigninPopup';
import 'typeface-roboto';
import FacetSnackbar from './shared/FacetSnackbar';
import AmplifyService from './services/AmplifyService';
import WelcomeAbroadStandalone from './shared/WelcomeAbroad/WelcomeAbroadStandalone';

Amplify.configure(awsExports);

const snackbarConfig = {
  autoHideDuration: 5000,
  vertical: 'bottom',
  horizontal: 'left'
}

// TODO fix duplication
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

/**
  *  TODO: Maybe this goes in bg script
  */
chrome && chrome.runtime.onMessage && chrome.runtime.onMessage.addListener(
  async (request, sender, sendResponse) => {
    if (request.data === ChromeRequestType.GET_LOGGED_IN_USER) {
      const data = await AmplifyService.getCurrentSession();
      sendResponse({
        data,
      });
    }
  },
);
console.log('CHECKA', window.disableMutationObserverScript);
// Adds facetizer into the client's DOM
if (!document.getElementById('popup') && !document.getElementById('facet-welcome-page') && !window.IN_PREVIEW) {
  const { body } = document;
  const facetDiv = document.createElement('div');
  facetDiv.setAttribute('style', `width: ${styles.drawerWidth}px !important`);
  facetDiv.id = domIds.facetizer;
  if (body) {
    body.prepend(facetDiv);
  }
}

if (document.getElementById(domIds.authentication) && isActivelyBeingDebugged(domIds.authentication)) {
  ReactDOM.render(
    <React.StrictMode>
      <SnackbarProvider
        maxSnack={4}
        disableWindowBlurListener
        autoHideDuration={snackbarConfig.autoHideDuration}
        iconVariant={{
          error: '✖️',
          warning: '⚠️',
        }}
        anchorOrigin={{
          vertical: snackbarConfig.vertical,
          horizontal: snackbarConfig.horizontal,
        }}
      >
        <div>
          <AppProvider>
            <Popup />
          </AppProvider>
        </div>
      </SnackbarProvider>
    </React.StrictMode>,
    document.getElementById(domIds.authentication),
  );
} else if (document.getElementById(domIds.popup) && isActivelyBeingDebugged(domIds.popup)) {
  ReactDOM.render(
    <React.StrictMode>
      <SnackbarProvider
        maxSnack={4}
        disableWindowBlurListener
        autoHideDuration={snackbarConfig.autoHideDuration}
        iconVariant={{
          error: '✖️',
          warning: '⚠️',
        }}
        anchorOrigin={{
          vertical: snackbarConfig.vertical,
          horizontal: snackbarConfig.horizontal,
        }}
      >
        <div style={{ display: 'grid' }}>
          <AppProvider>
            <PopupProvider id='popup-provider'>
              <SigninPopup />
            </PopupProvider>
          </AppProvider>
        </div>
      </SnackbarProvider>
    </React.StrictMode>,
    document.getElementById(domIds.popup),
  );
} else if (document.getElementById(domIds.facetizer) && isActivelyBeingDebugged(domIds.facetizer)) {
  ReactDOM.render(
    <React.StrictMode>
      <div style={{ width: `${styles.drawerWidth}px`, height: '100%' }} id="facet-sidebar">
        <SnackbarProvider
          style={{ height: '100%' }}
          maxSnack={4}
          disableWindowBlurListener
          autoHideDuration={snackbarConfig.autoHideDuration}
          iconVariant={{
            error: '✖️',
            warning: '⚠️',
          }}
          anchorOrigin={{
            vertical: snackbarConfig.vertical,
            horizontal: snackbarConfig.horizontal,
          }}
          content={(key, message) => (
            <FacetSnackbar id={key} {...message} />
          )}
        >
          <AppProvider>
            <CoreProvider>
              <App />
            </CoreProvider>
          </AppProvider>
        </SnackbarProvider>

      </div>
    </React.StrictMode >,
    document.getElementById(domIds.facetizer),
  );
} else if (document.getElementById(domIds.welcome) && isActivelyBeingDebugged(domIds.welcome)) {
  ReactDOM.render(
    <React.StrictMode>
      <WelcomeAbroadStandalone />
    </React.StrictMode>,
    document.getElementById(domIds.welcome),
  );
} else if (document.getElementById(domIds.previewLoadingBar) && isActivelyBeingDebugged(domIds.previewLoadingBar)) {

  (async () => {
    try {
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      await sleep(1000);

      var node = document.getElementsByTagName('html').item(0);
      node.style.visibility = "visible";
    } catch (e) {
      // Deal with the fact the chain failed
    }
  })();
}
