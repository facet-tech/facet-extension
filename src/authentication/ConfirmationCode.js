import { Auth } from "aws-amplify";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import PopupContext from "../popup/PopupContext";
import { authState as authStateConstant } from '../shared/constant';
import { Input, InputLabel, Button, Link } from '@material-ui/core';
import AppContext from "../AppContext";
import fnLogoHorizontal from '../static/images/fn_horizontal_logo.png';
import Alert from '@material-ui/lab/Alert';

export default () => {
    const { authObject, setAuthObject } = React.useContext(AppContext);
    const { setCurrAuthState } = React.useContext(PopupContext);
    const { register, errors, handleSubmit, watch } = useForm({});
    const [serverError, setServerError] = useState(undefined);

    const password = useRef({});
    password.current = watch("password", "");

    const onSubmit = async data => {
        console.log(JSON.stringify(data));
        const { confirmationCode } = data;
        try {
            // handle this properly..
            const user = await Auth.confirmSignUp(authObject.username, confirmationCode);
            console.log('Response:', user);
            setCurrAuthState(authStateConstant.signedIn);
        } catch (error) {
            setServerError(error.message);
        }
    };

    return (
        <React.Fragment>
            <div style={{ textAlign: 'center' }}>
                <img src={fnLogoHorizontal} />
            </div>
            <form onSubmit={e => e.preventDefault()}>
                <InputLabel>Confirmation Code:</InputLabel>
                <Input
                    id="confirmationCode"
                    name="confirmationCode"
                    aria-invalid={errors.email ? "true" : "false"}
                    inputRef={register({
                        required: "required"
                    })}
                />
                {errors.email && <span role="alert">{errors.confirmationCode.message}</span>}
                <Button style={{ width: "100%" }} variant="contained" color="primary" type="submit" primary={true} onClick={handleSubmit(onSubmit)}>Confirm</Button>
            </form>
            <br />
            {serverError && <Alert severity="error">{serverError}</Alert>}
            <br />
            <div>
                <div>
                    Don't have an account?
                    <Link inputRef="#" onClick={() => setCurrAuthState(authStateConstant.signingUp)}>
                        Sign up
                    </Link>
                </div>
            </div>
        </React.Fragment >
    );
}