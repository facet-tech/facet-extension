import React, { useRef } from "react";
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";
import PopupContext from "../popup/PopupContext";
import { authState as authStateConstant } from '../shared/constant';
import fnLogoHorizontal from '../static/images/fn_horizontal_logo.png';
import { Input, InputLabel, Button, Link } from '@material-ui/core';

export default () => {

  const { register, errors, handleSubmit, watch } = useForm({});
  const { setCurrAuthState } = React.useContext(PopupContext);

  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit = async data => {
    console.log(JSON.stringify(data));
    const { email, password } = data;
    try {
      Auth.confirmSignUp()
      const { user } = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          // 'timestamp': `${Date.now()}`,
        }
      });
      setCurrAuthState(authStateConstant.confirmingSignup);

    } catch (error) {
      console.log('error signing up:', error);
    }
  };

  return (
    <React.Fragment>
      <img src={fnLogoHorizontal} />
      <form onSubmit={e => e.preventDefault()}>
        <InputLabel htmlFor="fname">First name</InputLabel>
        <Input
          style={{ width: "100%" }}
          id="name"
          name="name"
          aria-invalid={errors.name ? "true" : "false"}
          inputRef={register({
            required: "required",
          })}
        />
        {errors.name && <span role="alert">{errors.name.message}</span>}
        <InputLabel htmlFor="sname">Last name</InputLabel>
        <Input
          style={{ width: "100%" }}
          id="lastName"
          name="lastName"
          aria-invalid={errors.lastName ? "true" : "false"}
          inputRef={register({
            required: "required",
          })}
        />
        {errors.lastName && <span role="alert">{errors.lastName.message}</span>}
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
          placeholder="example@mail.com"
        />
        {errors.email && <span role="alert">{errors.email.message}</span>}
        <InputLabel>Password</InputLabel>
        <Input
          style={{ width: "100%" }}
          name="password"
          type="password"
          inputRef={register({
            required: "You must specify a password",
            minLength: {
              value: 8,
              message: "Password must have at least 8 characters"
            }
          })}
        />
        {errors.password && <p>{errors.password.message}</p>}
        <InputLabel>Repeat password</InputLabel>
        <Input
          style={{ width: "100%" }}
          name="password_repeat"
          type="password"
          inputRef={register({
            validate: value =>
              value === password.current || "The passwords do not match"
          })}
        />
        {errors.password_repeat && <p>{errors.password_repeat.message}</p>}
        <Button style={{ width: "100%" }} variant="contained" color="primary" type="submit" primary={true} onClick={handleSubmit(onSubmit)}>Signup</Button>
      </form>
      <div>
        <Link href="#" onClick={() => setCurrAuthState(authStateConstant.signingIn)}>
          Already have an account? SignIn
        </Link>
      </div>
    </React.Fragment >
  );
}
