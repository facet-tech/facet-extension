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
import { storage, styles } from './shared/constant';
import awsExports from './aws-exports';
import Popup from './popup/Popup';
import PopupProvider from './popup/PopupProvider';
import SignIn from './authentication/SignIn';
import Main from './popup/Main';
import isUserLoggedIn from './shared/isUserLoggedIn';
import { setKeyInLocalStorage } from './shared/loadLocalStorage';

Amplify.configure(awsExports);

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


// TODO this needs cleanup
if (!document.getElementById('popup')) {
  const { body } = document;
  const facetDiv = document.createElement('div');
  facetDiv.setAttribute('style', `width: ${styles.drawerWidth}px !important`);
  facetDiv.id = 'facetizer';
  if (body) {
    body.prepend(facetDiv);
  }
}

if (document.getElementById('authentication')) {
  console.log('AT AUTH');
  ReactDOM.render(
    <React.StrictMode>
      <SnackbarProvider
        maxSnack={4}
        disableWindowBlurListener
        autoHideDuration={5000}
        iconVariant={{
          error: '✖️',
          warning: '⚠️',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div>
          <AppProvider>
            <Popup />
          </AppProvider>
        </div>
      </SnackbarProvider>
    </React.StrictMode>,
    document.getElementById('authentication'),
  );
} else if (document.getElementById('facetizer')) {
  ReactDOM.render(
    <React.StrictMode>
      <div style={{ width: `${styles.drawerWidth}px` }} id="facet-sidebar">
        <SnackbarProvider
          maxSnack={4}
          disableWindowBlurListener
          autoHideDuration={5000}
          iconVariant={{
            error: '✖️',
            warning: '⚠️',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <AppProvider>
            <CoreProvider>
              <App />
            </CoreProvider>
          </AppProvider>
        </SnackbarProvider>

      </div>
    </React.StrictMode>,
    document.getElementById('facetizer'),
  );
} else if (document.getElementById('popup')) {

  (async () => {
    try {
      const userHasLoggedIn = await isUserLoggedIn();
      console.log('@userHasLoggedIn', userHasLoggedIn)
      if (userHasLoggedIn) {
        ReactDOM.render(
          <React.StrictMode>
            <SnackbarProvider
              maxSnack={4}
              disableWindowBlurListener
              autoHideDuration={5000}
              iconVariant={{
                error: '✖️',
                warning: '⚠️',
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <div style={{ display: 'grid' }}>
                <AppProvider id='gg'>
                  <PopupProvider id='popup-provider'>
                    <Main />
                  </PopupProvider>
                </AppProvider>
              </div>
            </SnackbarProvider>
          </React.StrictMode>,
          document.getElementById('popup'),
        );
      } else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var currTab = tabs[0];
          chrome.tabs.create({ url: chrome.extension.getURL(`authentication.html?redirectTabId=${currTab.id}`) });//maybe with redirect
        });
        
        // chrome.tabs.sendMessage(tabs[0].id, { 'CLOSE_TAB': 'GG!' }, async () => {
        // });
      }
    } catch (e) {
      console.log('[ERROR]', e);
      // Deal with the fact the chain failed
    }
  })();
}