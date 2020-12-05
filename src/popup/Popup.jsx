/* global chrome */

import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import SignIn from '../authentication/SignIn';
import Signup from '../authentication/Signup';
import { authState as authStateConstant } from '../shared/constant';
import ConfirmationCode from '../authentication/ConfirmationCode';
import ForgotPassword from '../authentication/ForgotPassword';
import PasswordReset from '../authentication/PasswordReset';
import Main from './Main';
import AppContext from '../AppContext';
import getURLParams from '../shared/chrome/getURLParams';

const StyledDiv = styled.div`
    width: 20rem;
    align-self: center;
    justify-self: center;
`;

export default () => {
  const context = useContext(AppContext);
  const popupContext = React.useContext(AppContext);
  const { currAuthState, jwt } = useContext(AppContext);
  let displayElement;
  if (jwt || currAuthState === authStateConstant.signedIn) {
    // close current tab
    chrome.tabs.getCurrent(function (tab) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const redirectTabId = urlParams.get('redirectTabId');
      if (redirectTabId) {
        chrome.tabs.reload(parseInt(redirectTabId));
      }
      // todo uncomment
      chrome.tabs.remove(tab.id);
    });

    displayElement = null;
  } else if (currAuthState === authStateConstant.signingIn) {
    displayElement = <SignIn />;
  } else if (currAuthState === authStateConstant.signingUp) {
    displayElement = <Signup />;
  } else if (currAuthState === authStateConstant.confirmingSignup) {
    displayElement = <ConfirmationCode />;
  } else if (currAuthState === authStateConstant.onForgotPassword) {
    displayElement = <ForgotPassword />;
  } else if (currAuthState === authStateConstant.onPasswordReset) {
    displayElement = <PasswordReset />;
  } else {
    displayElement = <SignIn />;
  }

  return (
    <StyledDiv>
      {displayElement}
    </StyledDiv>
  );
};
