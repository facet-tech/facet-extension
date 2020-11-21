import { Auth } from "aws-amplify";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import PopupContext from "../popup/PopupContext";
import { authState as authStateConstant } from '../shared/constant';
import fnLogoHorizontal from '../static/images/fn_horizontal_logo.png';
import { Input, InputLabel, Button, Link } from '@material-ui/core';

export default () => {
  const { setCurrAuthState } = React.useContext(PopupContext);
  const { register, errors, handleSubmit, watch } = useForm({});
  const password = useRef({});
  password.current = watch("password", "");
  const onSubmit = async data => {
    console.log(JSON.stringify(data));
    const { email, password } = data;
    console.log('EHEW', data)
    try {

      const user = await Auth.signIn(email, password);
      console.log('USER!', user);
      setCurrAuthState(authStateConstant.signedIn);
    } catch (error) {
      console.log('error signing in', error);
      if (error.code === 'UserNotConfirmedException') {
        setCurrAuthState(authStateConstant.confirmingSignup);
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
            required: "required",
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
            required: "You must specify a password",
          })}
          placeholder="example@mail.com"
        />
        {errors.password && <p>{errors.password.message}</p>}
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