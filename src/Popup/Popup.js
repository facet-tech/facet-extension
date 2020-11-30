/* global chrome */

import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import PopupContext from './PopupContext';
import Main from './Main';
import SignIn from '../authentication/SignIn';
import Signup from '../authentication/Signup';
import { authState as authStateConstant } from '../shared/constant';
import ConfirmationCode from '../authentication/ConfirmationCode';
import ForgotPassword from '../authentication/ForgotPassword';
import PasswordReset from '../authentication/PasswordReset';

const StyledDiv = styled.div`
    width: 20rem;
`;

export default () => {
  const { currAuthState, jwt } = useContext(PopupContext);

  let displayElement;
  if (jwt || currAuthState === authStateConstant.signedIn) {
    displayElement = <Main />;
  } else if (currAuthState === authStateConstant.signingIn) {
    displayElement = <SignIn />;
  } else if (currAuthState === authStateConstant.signingUp) {
    displayElement = <Signup />;
  } else if (currAuthState === authStateConstant.confirmingSignup) {
    displayElement = <ConfirmationCode />;
  } else if (currAuthState === authStateConstant.signedIn) {
    displayElement = <Main />;
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
