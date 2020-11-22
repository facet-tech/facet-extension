import { Auth } from "aws-amplify";
import React, { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PopupContext from "../popup/PopupContext";
import { authState as authStateConstant } from '../shared/constant';
import fnLogoHorizontal from '../static/images/fn_horizontal_logo.png';
import { Input, InputLabel, Button, Link } from '@material-ui/core';

export default () => {
  const { setCurrAuthState } = React.useContext(PopupContext);
  const { register, errors, handleSubmit, watch } = useForm({});
  const [serverError, setServerError] = useState(undefined);

  console.log('errors!@!!!', errors);
  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit = async data => {
    console.log(JSON.stringify(data));
    const { email, password } = data;

    try {
      const userResponse = await Auth.signIn(email, password);
      setCurrAuthState(authStateConstant.signedIn);
    } catch (error) {
      console.log('error signing in', error);
      if (error.code === 'UserNotConfirmedException') {
        setCurrAuthState(authStateConstant.confirmingSignup);
      } else {
        setServerError(error.message)
      }
    }
  };

  return (
    <React.Fragment>
      <img src={fnLogoHorizontal} />
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
        {serverError && <p>{serverError}</p>}
        <div >
          <Button style={{ width: "100%" }} variant="contained" color="primary" type="submit" primary={true} onClick={handleSubmit(onSubmit)}>Login</Button>
        </div>
      </form>
      <div>
        <Link href="#" onClick={() => setCurrAuthState(authStateConstant.signingUp)}>
          Don't have an account? Signup
        </Link>
      </div>
    </React.Fragment >
  );
}