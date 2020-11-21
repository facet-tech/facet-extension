import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import PopupContext from "../popup/PopupContext";
import "./styles.css";

export default () => {
  const { onLoginClick } = React.useContext(PopupContext);
  const { register, errors, handleSubmit, watch } = useForm({});
  const password = useRef({});
  password.current = watch("password", "");
  const onSubmit = async data => {
    alert(JSON.stringify(data));
  };

  return (
    <React.Fragment>
      <form onSubmit={e => e.preventDefault()}>
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

        <input type="submit" onClick={handleSubmit(onSubmit)} />
      </form>
      <div>
      <span><a onClick={() => onLoginClick(false)}>Don't have an account? Signup</a></span>
      </div>
    </React.Fragment >
  );
}