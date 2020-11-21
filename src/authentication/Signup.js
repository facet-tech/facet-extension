import React, { useRef } from "react";
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";
import PopupContext from "../popup/PopupContext";
// import "./styles.css";

export default () => {

  const { register, errors, handleSubmit, watch } = useForm({});
  const { onLoginClick } = React.useContext(PopupContext);


  //signUp('waaaawdatawest123123', 'Taaawdaawdadwesawt123123', 'mtreamer333@gmail.com', '1232313231')

  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit = async data => {
    alert(JSON.stringify(data));
    // async function signupClick(username, password, email, phone_number) {
    //   try {
    //     const { user } = await Auth.signUp({
    //       username,
    //       password,
    //       attributes: {
    //         email,
    //       }
    //     });
    //     console.log("CHECKME", user);
    //   } catch (error) {
    //     console.log('error signing up:', error);
    //   }
    // }
  };

  return (
    <React.Fragment>
      <form onSubmit={e => e.preventDefault()}>
        <label htmlFor="name">First name</label>
        <input
          id="name"
          name="name"
          aria-invalid={errors.name ? "true" : "false"}
          ref={register({
            required: "required",
          })}
        />
        {errors.name && <span role="alert">{errors.name.message}</span>}
        <label htmlFor="email">Last name</label>
        <input
          id="lastName"
          name="lastName"
          aria-invalid={errors.lastName ? "true" : "false"}
          ref={register({
            required: "required",
          })}
        />
        {errors.lastName && <span role="alert">{errors.lastName.message}</span>}
        <label htmlFor="email">email</label>
        <input
          id="email"
          name="email"
          aria-invalid={errors.email ? "true" : "false"}
          ref={register({
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
        <label>Password</label>
        <input
          name="password"
          type="password"
          ref={register({
            required: "You must specify a password",
            minLength: {
              value: 8,
              message: "Password must have at least 8 characters"
            }
          })}
        />
        {errors.password && <p>{errors.password.message}</p>}
        <label>Repeat password</label>
        <input
          name="password_repeat"
          type="password"
          ref={register({
            validate: value =>
              value === password.current || "The passwords do not match"
          })}
        />
        {errors.password_repeat && <p>{errors.password_repeat.message}</p>}

        <input value="signup" type="submit" onClick={handleSubmit(onSubmit)} />
      </form>
      <div>
        <span><a onClick={() => onLoginClick(true)}>Already have an account? Login</a></span>
      </div>
    </React.Fragment >
  );
}
