import { Auth } from 'aws-amplify';
import React, { useRef, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import {
  Input, InputLabel, Button, Link,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import PopupContext from '../popup/PopupContext';
import { authState as authStateConstant } from '../shared/constant';
import facetLogo from '../static/images/facet_main_logo.svg';
import AppContext from '../AppContext';

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
      <div style={{ textAlign: 'center' }}>
        <img src={facetLogo} />
      </div>
      <br />
      <div>
        Check your email, a verification code has been sent. Don't see the code?
        <Link href="#" onClick={() => { resendConfirmationCode(); }}>
          {' '}
          Click here to resend
        </Link>
      </div>
      <br />
      <br />
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <InputLabel htmlFor="code">Enter your verification code</InputLabel>
          <Input
            style={{ width: '100%' }}
            id="code"
            name="code"
            aria-invalid={errors.code ? 'true' : 'false'}
            inputRef={register({
              required: 'Please enter your code',
            })}
            type="code"
          />
          {errors.code && <span role="alert">{errors.code.message}</span>}
        </div>
        <br />
        <div>
          <InputLabel>Password</InputLabel>
          <Input
            style={{ width: '100%' }}
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
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <br />
        <div>
          <InputLabel>Repeat password</InputLabel>
          <Input
            style={{ width: '100%' }}
            name="password_repeat"
            type="password"
            inputRef={register({
              validate: (value) => value === password.current || 'The passwords do not match',
            })}
          />
          {errors.password_repeat && <p>{errors.password_repeat.message}</p>}
        </div>
        <br />
        <div>
          <Button style={{ width: '100%' }} variant="contained" color="primary" type="submit" onClick={handleSubmit(onSubmit)}>Reset password</Button>
        </div>
      </form>
      <br />
      {serverError && <Alert severity="error">{serverError}</Alert>}
      <br />
      <div>
        Don't have an account?
        <Link href="#" onClick={() => setCurrAuthState(authStateConstant.signingUp)}>
          {' '}
          Sign up
        </Link>
      </div>
    </>
  );
};
