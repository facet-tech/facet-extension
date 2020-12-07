import { Auth } from "aws-amplify";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import PopupContext from "../popup/PopupContext";
import { authState as authStateConstant, color } from '../shared/constant';
import faceLogo from '../static/images/facet_main_logo.svg';
import { Input, InputLabel, Button, Link } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AppContext from "../AppContext";
import FacetFormContainer from "../shared/FacetFormContainer";
import FacetInput from "../shared/FacetInput";
import FacetLabel from "../shared/FacetLabel";
import FacetButton from "../shared/FacetButton";
import FacetLink from "../shared/FacetLink";

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
        <>
            <FacetFormContainer>
                <form onSubmit={e => e.preventDefault()}>
                    <FacetLabel text="EMAIL" htmlFor="email" />
                    <FacetInput
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
                    {errors.email && <FacetFormError text={errors.email.message} role="alert" />}
                </form>
                <br />
                {serverError && <Alert severity="error">{serverError}</Alert>}
                <br />
                <div>
                    <FacetButton text="Confirm email" style={{ width: "100%" }} variant="contained" color="primary" type="submit" onClick={handleSubmit(onSubmit)} />
                </div>
                <div>
                    <br />
                    <b>
                        <FacetLink text="Login" color={color.electricB} onClick={() => setCurrAuthState(authStateConstant.signingIn)} />
                    </b>
                </div>
            </FacetFormContainer>
        </ >
    );
}