import { Auth } from 'aws-amplify';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Input, InputLabel, Button, Link,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import PopupContext from '../popup/PopupContext';
import {
  authState as authStateConstant, isPluginEnabled, storage, api as apiConstant,
} from '../shared/constant';
import fnLogoHorizontal from '../static/images/fn_horizontal_logo.png';
import AppContext from '../AppContext';
import triggerDOMReload from '../shared/popup/triggerDOMReload';
import { setKeyInLocalStorage } from '../shared/loadLocalStorage';
import { getOrCreateWorkspace } from '../Services/FacetApiService';

export default () => {
  const { authObject, setAuthObject } = React.useContext(AppContext);
  const { setCurrAuthState } = React.useContext(PopupContext);
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
      await Auth.signIn(email, password);
      const workspaceResponse = await getOrCreateWorkspace(email);
      await setKeyInLocalStorage(apiConstant.workspace.workspaceId,
        workspaceResponse?.response?.workspaceId);
      await setKeyInLocalStorage(isPluginEnabled, true);
      await setKeyInLocalStorage(storage.username, email);
      await setKeyInLocalStorage(storage.password, password);
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
        <img src={fnLogoHorizontal} />
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <InputLabel htmlFor="email">email</InputLabel>
        <Input
          style={{ width: '100%' }}
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
        {errors.email && <span role="alert">{errors.email.message}</span>}
        <InputLabel>Password</InputLabel>
        <Input
          style={{ width: '100%' }}
          name="password"
          type="password"
          inputRef={register({
            required: 'Please specify a password',
          })}
          placeholder="example@mail.com"
        />
        {errors.password && <p>{errors.password.message}</p>}
        <br />
        <br />
        <div>
          Forgot your password?
          <Link href="#" onClick={() => setCurrAuthState(authStateConstant.onForgotPassword)}>
            {' '}
            Click here to reset it.
          </Link>
        </div>
        <br />
        <div>
          <Button style={{ width: '100%' }} variant="contained" color="primary" type="submit" onClick={handleSubmit(onSubmit)}>Login</Button>
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
