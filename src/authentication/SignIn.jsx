import { Auth } from 'aws-amplify';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Input, InputLabel, Button, Link, Typography, makeStyles,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import PopupContext from '../popup/PopupContext';
import {
  authState as authStateConstant, isPluginEnabled, storage, api as apiConstant,
} from '../shared/constant';
import facetLogo from '../static/images/facet_main_logo.png';
import AppContext from '../AppContext';
import triggerDOMReload from '../shared/popup/triggerDOMReload';
import { setKeyInLocalStorage } from '../shared/loadLocalStorage';
import { getOrCreateWorkspace } from '../services/facetApiService';
import FacetInput from '../shared/FacetInput';
import FacetLabel from '../shared/FacetLabel';
import FacetButton from '../shared/FacetButton';
import FacetLink from '../shared/FacetLink';
import SecondaryFacetLink from '../shared/FacetSecondaryLink';
import styled from 'styled-components';
import facetTypographyIcon from '../static/images/facet_typography.png';

const BorderDiv = styled.div`
  border: 2px solid #758EBF;
  textAlign: center;
  padding: 1rem;
`;

const useStyles = makeStyles(() => ({
  center: {
    textAlign: 'center',
  },
}));

export default () => {
  const classes = useStyles();
  const { authObject, setAuthObject, setCurrAuthState } = React.useContext(AppContext);
  const {
    register, errors, handleSubmit, watch,
  } = useForm({});
  const [serverError, setServerError] = useState(undefined);

  const password = useRef({});
  password.current = watch('password', '');

  const onSubmit = async (data) => {
    const { email, password } = data;

    // abstract this method... to be used during signup too
    try {
      await setKeyInLocalStorage(isPluginEnabled, true);
      await setKeyInLocalStorage(storage.username, email);
      await setKeyInLocalStorage(storage.password, password);
      await Auth.signIn(email, password);
      const workspaceResponse = await getOrCreateWorkspace(email);
      await setKeyInLocalStorage(apiConstant.workspace.workspaceId,
        workspaceResponse?.response?.workspaceId);
      setCurrAuthState(authStateConstant.signedIn);
      setAuthObject({
        ...authObject,
        email,
      });
      triggerDOMReload();
    } catch (error) {
      console.log('[ERROR]][SignIn]', error);
      if (error.code === 'UserNotConfirmedException') {
        setCurrAuthState(authStateConstant.confirmingSignup);
      } else {
        setServerError(error.message);
      }
    }
  };

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <img src={facetLogo} />
      </div>
      <br />
      <br />
      <BorderDiv>
        <h3 style={{ color: '#C4DDF2' }}>Login</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <FacetLabel htmlFor="email" text="EMAIL"></FacetLabel>
          <FacetInput
            id="email"
            name="email"
            aria-invalid={errors.email ? 'true' : 'false'}
            inputRef={register({
              required: 'Please specify an email',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Entered value does not match email format',
              },
            })}
            type="email"
          />
          <br />
          {errors.email && <span role="alert">{errors.email.message}</span>}
          <FacetLabel text="Password" />
          <FacetInput
            name="password"
            type="password"
            inputRef={register({
              required: 'Please specify a password',
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
          <br />
          <div>
            <FacetButton style={{ width: '100%' }} variant="contained" color="primary" type="submit" onClick={handleSubmit(onSubmit)} text="Login"></FacetButton>
          </div>
          <br />
          <div className={classes.center}>
            <div>
              <FacetLink text='RESET PASSWORD' onClick={() => setCurrAuthState(authStateConstant.onForgotPassword)} />
            </div>
            <br />
            <Typography>
              <FacetLabel text='No profile? ' /><FacetLink text='Register here.' href="#" onClick={() => { setCurrAuthState(authStateConstant.signingUp) }} />
              <br />
              <br />
              <FacetLabel text="By logging into Facet you agree to the terms of use and privacy policy." />
            </Typography>
          </div>
        </form>
        {serverError && <Alert severity="error">{serverError}</Alert>}
        <br />
      </BorderDiv>
      <br />
      <div className={classes.center}>
        <img src={facetTypographyIcon} />
      </div>
    </>
  );
};
