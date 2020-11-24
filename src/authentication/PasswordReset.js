import { Auth } from "aws-amplify";
import React, { useRef, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import PopupContext from "../popup/PopupContext";
import { authState as authStateConstant } from '../shared/constant';
import fnLogoHorizontal from '../static/images/fn_horizontal_logo.png';
import { Input, InputLabel, Button, Link } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AppContext from "../AppContext";

export default () => {
    const { setCurrAuthState } = useContext(PopupContext);
    const { register, errors, handleSubmit, watch } = useForm({});
    const { authObject, setAuthObject } = useContext(AppContext);
    const [serverError, setServerError] = useState(undefined);

    const password = useRef({});
    password.current = watch("password", "");

    const onSubmit = async data => {
        console.log(JSON.stringify(data));
        const { email } = authObject;
        const { code, password } = data;

        try {
            const pwResetResponse = await Auth.forgotPasswordSubmit(email, code, password);
            console.log('pwResetResponse', pwResetResponse);
            setCurrAuthState(authStateConstant.signedIn);
        } catch (error) {
            console.log('error at PasswordReset', error);
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
            <br />
            <div>
                Check your email, a verification code has been sent. Don't see the code?
            <Link href="#">
                    {' '}Click here to resend
            </Link>
            </div>
            <br />
            <br />
            <form onSubmit={e => e.preventDefault()}>
                <div>
                    <InputLabel htmlFor="code">Enter your verification code</InputLabel>
                    <Input
                        style={{ width: "100%" }}
                        id="code"
                        name="code"
                        aria-invalid={errors.code ? "true" : "false"}
                        inputRef={register({
                            required: "Please enter your code",
                        })}
                        type="code"
                    />
                    {errors.code && <span role="alert">{errors.code.message}</span>}
                </div>
                <br />
                <div>
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
                </div>
                <br />
                <div>
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
                </div>
                <br />
                <div >
                    <Button style={{ width: "100%" }} variant="contained" color="primary" type="submit" primary={true} onClick={handleSubmit(onSubmit)}>Reset password</Button>
                </div>
            </form>
            <br />
            {serverError && <Alert severity="error">{serverError}</Alert>}
            <br />
            <div>Don't have an account?
            <Link href="#" onClick={() => setCurrAuthState(authStateConstant.signingUp)}>
                    {' '}Sign up
            </Link>
            </div>
        </React.Fragment >
    );
}