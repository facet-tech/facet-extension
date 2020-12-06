import { Auth } from "aws-amplify";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import PopupContext from "../popup/PopupContext";
import { authState as authStateConstant } from '../shared/constant';
import faceLogo from '../static/images/facet_main_logo.svg';
import { Input, InputLabel, Button, Link } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AppContext from "../AppContext";

export default () => {
    const { setCurrAuthState } = React.useContext(AppContext);
    const { authObject, setAuthObject } = React.useContext(AppContext);
    const { register, errors, handleSubmit } = useForm({});
    const [serverError, setServerError] = useState(undefined);

    const onSubmit = async data => {
        const { email } = data;

        try {
            const confirmSignUpResponse = await Auth.forgotPassword(email);
            setCurrAuthState(authStateConstant.onPasswordReset);
        } catch (error) {
            setServerError(error.message);
        }
    };

    return (
        <React.Fragment>
            <div style={{ textAlign: 'center' }}>
                <img src={faceLogo} />
            </div>
            <form onSubmit={e => e.preventDefault()}>
                <InputLabel htmlFor="email">Email</InputLabel>
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
                    onChange={(e) => setAuthObject({
                        ...authObject,
                        email: e.target.value
                    })}
                    type="email"
                />
                {errors.email && <span role="alert">{errors.email.message}</span>}
            </form>
            <br />
            {serverError && <Alert severity="error">{serverError}</Alert>}
            <br />
            <div>
                <Button style={{ width: "100%" }} variant="contained" color="primary" type="submit" onClick={handleSubmit(onSubmit)}>
                    Confirm email
                </Button>
            </div>
            <div>
                <br />
            Don't have an account?
            <Link href="#" onClick={() => setCurrAuthState(authStateConstant.signingUp)}>{' '}Sign up</Link>
            </div>
        </React.Fragment >
    );
}