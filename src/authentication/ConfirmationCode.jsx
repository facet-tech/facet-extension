import { Auth } from "aws-amplify";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import PopupContext from "../popup/PopupContext";
import { authState as authStateConstant, color } from '../shared/constant';
import { Input, InputLabel, Button, Link } from '@material-ui/core';
import AppContext from "../AppContext";
import facetLogo from '../static/images/facet_main_logo.svg';
import Alert from '@material-ui/lab/Alert';
import { useSnackbar } from 'notistack';
import FacetFormContainer from "../shared/FacetFormContainer";
import FacetLink from "../shared/FacetLink";
import FacetLabel from "../shared/FacetLabel";
import FacetInput from "../shared/FacetInput";
import FacetFormError from "../shared/FacetFormError";
import FacetButton from "../shared/FacetButton";

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
            enqueueSnackbar(`Confirmation code has been sent in your email.`, { variant: "success" });
        } catch (e) {
            console.log('[ERROR]', e);
        }
    }

    return (
        <>
            <br />
            <FacetFormContainer>
                <FacetLabel text="An email has been sent to your address with an authorization key." />
                <br />
                <FacetLabel text="I did not get any email." />
                <FacetLink color={color.electricB} text="Resend key to my email" onClick={() => { resendConfirmationCode() }} />
                <FacetLabel text="or" />
                <FacetLink color={color.electricB} text="Register again" onClick={() => { setCurrAuthState(auth) }} />
                <br />
                <br />
                <form onSubmit={e => e.preventDefault()}>
                    <FacetLabel text="KEY" />
                    <br />
                    <FacetInput
                        id="confirmationCode"
                        name="confirmationCode"
                        aria-invalid={errors.email ? "true" : "false"}
                        inputRef={register({
                            required: "required"
                        })}
                    />
                    {errors.email && <FacetFormError text="errors.confirmationCode.message" role="alert" />}
                    <br />
                    <FacetButton text="CONFIRM" style={{ width: "100%" }} variant="contained" color="primary" type="submit" onClick={handleSubmit(onSubmit)} />
                </form>
                <br />
                {serverError && <Alert severity="error">{serverError}</Alert>}
                <br />
                <div style={{ textAlign: 'center' }}>
                <b>
                    <FacetLink text="Login" color={color.electricB} onClick={() => setCurrAuthState(authStateConstant.signingIn)} />
                </b>
            </div>
            </FacetFormContainer>
        </ >
    );
}