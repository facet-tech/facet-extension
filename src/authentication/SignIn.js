import { Auth } from "aws-amplify";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import PopupContext from "../popup/PopupContext";
import { authState as authStateConstant } from '../shared/constant';
import fnLogoHorizontal from '../static/images/fn_horizontal_logo.png';
import { Input, InputLabel, Button, Link } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

export default () => {
  const { setCurrAuthState } = React.useContext(PopupContext);
  const { register, errors, handleSubmit, watch } = useForm({});
  const [serverError, setServerError] = useState(undefined);

  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit = async data => {
    console.log(JSON.stringify(data));
    const { email, password } = data;

    try {
      await Auth.signIn(email, password);
      Auth.currentSession().then(res => {
        let accessToken = res.getAccessToken()
        let jwt = accessToken.getJwtToken()
        //You can print them to see the full objects
        console.log(`myAccessToken: ${JSON.stringify(accessToken)}`)
        console.log(`myJwt: ${jwt}`)
      })
      setCurrAuthState(authStateConstant.signedIn);
    } catch (error) {
      console.log('error signing in', error);
      if (error.code === 'UserNotConfirmedException') {
        setCurrAuthState(authStateConstant.confirmingSignup);
      } else {
        setServerError(error.message);
      }
    }
  };

  return (
    <React.Fragment>
      <div style={{ textAlign: 'center' }}>
        <img src={fnLogoHorizontal} />
      </div>
      <form onSubmit={e => e.preventDefault()}>
        <InputLabel htmlFor="email">email</InputLabel>
        <Input
          style={{ width: "100%" }}
          id="email"
          name="email"
          aria-invalid={errors.email ? "true" : "false"}
          inputRef={register({
            required: "Please specify an email",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Entered value does not match email format"
            }
          })}
          type="email"
        />
        {errors.email && <span role="alert">{errors.email.message}</span>}
        <InputLabel>Password</InputLabel>
        <Input
          style={{ width: "100%" }}
          name="password"
          type="password"
          inputRef={register({
            required: "Please specify a password",
          })}
          placeholder="example@mail.com"
        />
        {errors.password && <p>{errors.password.message}</p>}
        <br />
        <div >
          <Button style={{ width: "100%" }} variant="contained" color="primary" type="submit" primary={true} onClick={handleSubmit(onSubmit)}>Login</Button>
        </div>
      </form>
      <br />
      {serverError && <Alert severity="error">{serverError}</Alert>}
      <br />
      <div>
        Don't have an account?
        <Link href="#" onClick={() => setCurrAuthState(authStateConstant.signingUp)}>
          {' '}Sign up
        </Link>
      </div>
    </React.Fragment >
  );
}