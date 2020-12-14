import { Auth } from "aws-amplify";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import PopupContext from "../popup/PopupContext";
import { authState as authStateConstant, color, snackbar } from '../shared/constant';
import { Input, InputLabel, Button, Link } from '@material-ui/core';
import AppContext from "../AppContext";
import Alert from '@material-ui/lab/Alert';
import { useSnackbar } from 'notistack';
import FacetFormContainer from "../shared/FacetFormContainer";
import FacetLink from "../shared/FacetLink";
import FacetLabel from "../shared/FacetLabel";
import FacetInput from "../shared/FacetInput";
import FacetFormError from "../shared/FacetFormError";
import FacetButton from "../shared/FacetButton";
import MarginTop from "../shared/MarginTop";

export default () => {
    const { enqueueSnackbar } = useSnackbar();
    const { authObject } = React.useContext(AppContext);
    const { setCurrAuthState } = React.useContext(AppContext);
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
            enqueueSnackbar({
                message: `Confirmation code has been sent in your email.`,
                variant: snackbar.success.text
            });
        } catch (e) {
            console.log('[ERROR]', e);
        }
    }

    return (
        <>
            <br />
            <FacetFormContainer>
                <FacetLabel text="Authorization Key" />
                <FacetLabel text="An authorization key was sent to your email." />
                <br />
                <FacetLink color={color.electricB} text="Resend email" onClick={() => { resendConfirmationCode() }} />
                <br />
                <br />
                <form onSubmit={e => e.preventDefault()}>
                    <br />
                    <FacetInput
                        id="key"
                        name="KEY"
                        aria-invalid={errors.email ? "true" : "false"}
                        inputRef={register({
                            required: "required"
                        })}
                    />
                    {errors.email && <FacetFormError text="errors.confirmationCode.message" role="alert" />}
                    <MarginTop value='.5rem' />
                    <FacetButton text="CONFIRM" style={{ width: "100%" }} variant="contained" color="primary" type="submit" onClick={handleSubmit(onSubmit)} />
                </form>
                <br />
                {serverError && <Alert severity="error">{serverError}</Alert>}
                <br />
                <div style={{ textAlign: 'center' }}>
                    <b>
                        <FacetLink text="Sign in" color={color.electricB} onClick={() => setCurrAuthState(authStateConstant.signingIn)} />
                    </b>
                </div>
            </FacetFormContainer>
        </ >
    );
}