/* global chrome */

import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import SignIn from '../authentication/SignIn';
import Signup from '../authentication/Signup';
import { authState, authState as authStateConstant } from '../shared/constant';
import ConfirmationCode from '../authentication/ConfirmationCode';
import ForgotPassword from '../authentication/ForgotPassword';
import PasswordReset from '../authentication/PasswordReset';
import Main from './Main';
import AppContext from '../AppContext';
import WelcomeAbroad from '../shared/WelcomeAbroad/WelcomeAbroad';

const StyledDiv = styled.div`
    display: grid;
    align-items: center;
    justify-items: center;
    background-color: #181D26;
    height: 100%;
`;

const InnerDiv = styled.div`
    width: 100%;
    max-width: 30rem;
`;

export default () => {
  const context = useContext(AppContext);
  const popupContext = React.useContext(AppContext);
  const { currAuthState, jwt, setCurrAuthState } = useContext(AppContext);
  let displayElement;

  useEffect(() => {
    async function loadState() {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const type = urlParams.get('type');
      if (type === "register") {
        setCurrAuthState(authState.signingUp);
      }
    }
    loadState();
  }, [])
  //jwt || currAuthState === authStateConstant.signedIn
  if (false) {
    // Commented this in favor of WelcomeAbroad component
    // chrome.tabs.getCurrent(function (tab) {
    //   const queryString = window.location.search;
    //   const urlParams = new URLSearchParams(queryString);
    //   const redirectTabId = urlParams.get('redirectTabId');
    //   if (redirectTabId) {
    //     chrome.tabs.reload(parseInt(redirectTabId));
    //   }
    //   // todo uncomment
    //   chrome.tabs.remove(tab.id);
    // });

    displayElement = <WelcomeAbroad />;
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
      <InnerDiv>
        {displayElement}
      </InnerDiv>
    </StyledDiv>
  );
};
