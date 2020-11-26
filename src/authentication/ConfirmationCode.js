import { Auth } from "aws-amplify";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import PopupContext from "../popup/PopupContext";
import { authState as authStateConstant } from '../shared/constant';
import { Input, InputLabel, Button, Link } from '@material-ui/core';
import AppContext from "../AppContext";
import fnLogoHorizontal from '../static/images/fn_horizontal_logo.png';
import Alert from '@material-ui/lab/Alert';
import { useSnackbar } from 'notistack';

export default () => {
    const { enqueueSnackbar } = useSnackbar();
    const { authObject } = React.useContext(AppContext);
    const { setCurrAuthState } = React.useContext(PopupContext);
    const { register, errors, handleSubmit, watch } = useForm({});
    const [serverError, setServerError] = useState(undefined);
    const password = useRef({});
    password.current = watch("password", "");

    const onSubmit = async data => {
        const { confirmationCode } = data;

        try {
            const confirmSignUpResponse = await Auth.confirmSignUp(authObject.email, confirmationCode);
            setCurrAuthState(authStateConstant.signedIn);
        } catch (error) {
            setServerError(error.message);
        }
    };

    const resendConfirmationCode = async () => {
        try {
            const response = await Auth.resendSignUp(authObject.email);
            enqueueSnackbar(`Confirmation code has been sent in your email.`, { variant: "success" });
        } catch (e) {
            console.log('[ERROR]', e);
        }
    }

    return (
        <React.Fragment>
            <div style={{ textAlign: 'center' }}>
                <img src={fnLogoHorizontal} />
            </div>
            <br />
            <div>
                Check your email, a confirmation code has been sent. Don't see the code?
            <Link href="#" onClick={() => { resendConfirmationCode() }}>
                {' '}Click here to resend.
            </Link>
            </div>
            <br />
            <br />
            <form onSubmit={e => e.preventDefault()}>
                <InputLabel>Enter Confirmation Code:</InputLabel>
                <Input
                    id="confirmationCode"
                    name="confirmationCode"
                    aria-invalid={errors.email ? "true" : "false"}
                    inputRef={register({
                        required: "required"
                    })}
                />
                {errors.email && <span role="alert">{errors.confirmationCode.message}</span>}
                <br />
                <Button style={{ width: "100%" }} variant="contained" color="primary" type="submit" onClick={handleSubmit(onSubmit)}>Confirm</Button>
            </form>
            <br />
            {serverError && <Alert severity="error">{serverError}</Alert>}
            <br />
            <div>
                <div>
                    Don't have an account?
                    <Link href="#" onClick={() => setCurrAuthState(authStateConstant.signingUp)}>
                        {' '}Sign up
                    </Link>
                </div>
            </div>
        </React.Fragment >
    );
}