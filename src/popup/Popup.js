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
import PopupContext from './PopupContext';
import SomeNewContext from './SomeNewContext';

const StyledDiv = styled.div`
    width: 20rem;
`;

export default () => {
  const context = useContext(AppContext);
  const popupContext = React.useContext(AppContext);
  const somenew = React.useContext(SomeNewContext);
  console.log('somenew',popupContext);
  console.log('context','gg',context);
  const { currAuthState, jwt } = useContext(AppContext);
  console.log('CURRAUTHST811',currAuthState);
  let displayElement;
  if (jwt || currAuthState === authStateConstant.signedIn) {
    console.log('QQ1')
    displayElement = <Main />;
  } else if (currAuthState === authStateConstant.signingIn) {
    console.log('QQ2')
    displayElement = <SignIn />;
  } else if (currAuthState === authStateConstant.signingUp) {
    console.log('QQ3')
    displayElement = <Signup />;
  } else if (currAuthState === authStateConstant.confirmingSignup) {
    console.log('QQ4!')
    displayElement = <ConfirmationCode />;
  } else if (currAuthState === authStateConstant.signedIn) {
    console.log('QQ5')
    displayElement = <Main />;
  } else if (currAuthState === authStateConstant.onForgotPassword) {
    console.log('QQ6')
    displayElement = <ForgotPassword />;
  } else if (currAuthState === authStateConstant.onPasswordReset) {
    console.log('QQ7',currAuthState)
    displayElement = <PasswordReset />;
  } else {
    console.log('MPIKA');
    displayElement = <SignIn />;
  }

  return (
    <StyledDiv>
      {displayElement}
    </StyledDiv>
  );
};
