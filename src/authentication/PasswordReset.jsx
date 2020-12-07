import { Auth } from 'aws-amplify';
import React, { useRef, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import {
  Input, InputLabel, Button, Link,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import PopupContext from '../popup/PopupContext';
import { authState as authStateConstant, color } from '../shared/constant';
import facetLogo from '../static/images/facet_main_logo.svg';
import AppContext from '../AppContext';
import FacetLink from '../shared/FacetLink';
import FacetInput from '../shared/FacetInput';
import FacetLabel from '../shared/FacetLabel';
import FacetButton from '../shared/FacetButton';
import FacetFormContainer from '../shared/FacetFormContainer';
import FacetFormError from '../shared/FacetFormError';

export default () => {
  const { setCurrAuthState } = useContext(AppContext);
  const {
    register, errors, handleSubmit, watch,
  } = useForm({});
  const { authObject, setAuthObject } = useContext(AppContext);
  const [serverError, setServerError] = useState(undefined);

  const password = useRef({});
  password.current = watch('password', '');

  const onSubmit = async (data) => {
    const { email } = authObject;
    const { code, password } = data;

    try {
      const pwResetResponse = await Auth.forgotPasswordSubmit(email, code, password);
      setCurrAuthState(authStateConstant.signedIn);
    } catch (error) {
      if (error.code === 'UserNotConfirmedException') {
        setCurrAuthState(authStateConstant.confirmingSignup);
      } else {
        setServerError(error.message);
      }
    }
  };

  const resendConfirmationCode = async () => {
    try {
      const response = await Auth.resendSignUp(authObject.email);
      enqueueSnackbar('Confirmation code has been sent in your email.', { variant: 'success' });
    } catch (e) {
      console.log('[ERROR]', e);
    }
  };

  return (
    <>
      <br />
      <FacetFormContainer>
        <div>
          <FacetLabel text="Check your email, a verification code has been sent. Don't see the code? " />
          <FacetLink color={color.electricB} text="Click here to resend" href="#" onClick={() => { resendConfirmationCode(); }} />
        </div>
        <br />
        <br />
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <FacetLabel text="Enter your verification code" htmlFor="code" />
            <FacetInput
              id="code"
              name="code"
              aria-invalid={errors.code ? 'true' : 'false'}
              inputRef={register({
                required: 'Please enter your code',
              })}
              type="code"
            />
            {errors.code && <FacetFormError text={errors.code.message} role="alert" />}
          </div>
          <br />
          <div>
            <FacetLabel text="Password" />
            <FacetInput
              name="password"
              type="password"
              inputRef={register({
                required: 'You must specify a password',
                minLength: {
                  value: 8,
                  message: 'Password must have at least 8 characters',
                },
              })}
            />
            {errors.password && <FacetFormError text={errors.password.message} />}
          </div>
          <br />
          <div>
            <FacetLabel text="Repeat password" />
            <FacetInput
              name="password_repeat"
              type="password"
              inputRef={register({
                validate: (value) => value === password.current || 'The passwords do not match',
              })}
            />
            {errors.password_repeat && <FacetFormError text={errors.password_repeat.message} />}
          </div>
          <br />
          <div>
            <FacetButton style={{ width: '100%' }} variant="contained" color="primary" type="submit" text="Reset password" onClick={handleSubmit(onSubmit)} />
          </div>
        </form>
        <br />
        {serverError && <Alert severity="error">{serverError}</Alert>}
        <br />
        <div>
          <FacetLabel text="Don't have an account? " />
          <FacetLink text="Register" href="#" onClick={() => setCurrAuthState(authStateConstant.signingUp)} />
        </div>
      </FacetFormContainer>
    </>
  );
};
