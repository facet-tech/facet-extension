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
import { styles } from './shared/constant';
import awsExports from './aws-exports';
import Popup from './Popup/Popup';
import PopupProvider from './popup/PopupProvider';
import SomeNewProvider from './popup/SomeNewProvider';

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
  const { body } = document;
  const facetDiv = document.createElement('div');
  facetDiv.setAttribute('style', `width: ${styles.drawerWidth}px !important`);
  facetDiv.id = 'facetizer';
  if (body) {
    body.prepend(facetDiv);
  }
}

if (document.getElementById('facetizer')) {
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
}

// TODO fix duplication
if (document.getElementById('popup')) {
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
        <div style={{display: 'grid'}}>
          <AppProvider id='gg'>
            <PopupProvider id='popup-provider'>
              <Popup id='facet-popup' />
            </PopupProvider>
          </AppProvider>
        </div>
      </SnackbarProvider>
    </React.StrictMode>,
    document.getElementById('popup'),
  );
}