import { Auth } from 'aws-amplify';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Typography, makeStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {
  authState as authStateConstant, isPluginEnabled, storage, api as apiConstant, color,
} from '../shared/constant';
import AppContext from '../AppContext';
import triggerDOMReload from '../shared/popup/triggerDOMReload';
import { setKeyInLocalStorage } from '../shared/loadLocalStorage';
import { getOrCreateWorkspace } from '../services/facetApiService';
import FacetInput from '../shared/FacetInput';
import FacetLabel from '../shared/FacetLabel';
import FacetButton from '../shared/FacetButton';
import FacetLink from '../shared/FacetLink';
import FacetFormError from '../shared/FacetFormError';
import FacetFormContainer from '../shared/FacetFormContainer';
import MarginTop from '../shared/MarginTop';

const useStyles = makeStyles(() => ({
  center: {
    textAlign: 'center',
  },
}));

export default () => {
  const classes = useStyles();
  const { authObject, setAuthObject, setCurrAuthState, persistLogin } = React.useContext(AppContext);
  const { register, errors, handleSubmit, watch } = useForm({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(undefined);

  const password = useRef({});
  password.current = watch('password', '');

  const onSubmit = async (data) => {
    setSubmitting(true);
    const { email, password } = data;
    try {
      await persistLogin(email, password);
      triggerDOMReload();
      setSubmitting(false);
    } catch (error) {
      console.log('[ERROR]][SignIn]', error);
      if (error.code === 'UserNotConfirmedException') {
        setAuthObject({
          ...authObject,
          email,
          password
        });
        setCurrAuthState(authStateConstant.confirmingSignup);
      } else {
        setServerError(error.message);
      }
      setSubmitting(false);
    }
  };

  return (
    <>
      <FacetFormContainer>
        <h3 style={{ color: color.ice }}>Login</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <FacetLabel htmlFor="email" text="Email"></FacetLabel>
          <MarginTop value='.5rem' />
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
          {errors.email && <FacetFormError role="alert" text={errors.email.message}></FacetFormError>}
          <br />
          <FacetLabel text="Password" />
          <MarginTop value='.5rem' />
          <FacetInput
            name="password"
            type="password"
            inputRef={register({
              required: 'Please specify a password',
            })}
          />
          <br />
          {errors.password && <FacetFormError role="alert" text={errors.password.message}></FacetFormError>}
          <br />
          <div>
            <FacetButton disabled={submitting} style={{ width: '100%' }} variant="contained" color="primary" type="submit" onClick={handleSubmit(onSubmit)} text="Login"></FacetButton>
          </div>
          <br />
          <div className={classes.center}>
            <div>
              <FacetLink underline='hover' text='RESET PASSWORD' onClick={() => setCurrAuthState(authStateConstant.onForgotPassword)} />
            </div>
            <br />
            <Typography>
              <b>
                <FacetLabel text='Not registered? ' />
                <FacetLink color={color.electricB} text='Sign up.' href="#" onClick={() => { setCurrAuthState(authStateConstant.signingUp) }} />
              </b>
              <br />
              <br />
              <FacetLabel text="By logging into Facet you agree to the terms of use and conditions of you and the privacy policy." />
            </Typography>
          </div>
        </form>
        {serverError && <Alert severity="error">{serverError}</Alert>}
        <br />
      </FacetFormContainer>
    </>
  );
};
