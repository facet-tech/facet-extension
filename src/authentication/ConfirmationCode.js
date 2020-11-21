import { Auth } from "aws-amplify";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import PopupContext from "../popup/PopupContext";
import { authState as authStateConstant } from '../shared/constant';
import { Input, InputLabel, Button, Link } from '@material-ui/core';
import AppContext from "../AppContext";
import fnLogoHorizontal from '../static/images/fn_horizontal_logo.png';

export default () => {
    const { authObject, setAuthObject } = React.useContext(AppContext);
    console.log('Authobj', authObject);
    const { setCurrAuthState } = React.useContext(PopupContext);
    const { register, errors, handleSubmit, watch } = useForm({});
    const password = useRef({});
    password.current = watch("password", "");
    const onSubmit = async data => {
        console.log(JSON.stringify(data));
        const { confirmationCode } = data;
        console.log('Authobj2!!', authObject);
        try {
            // handle this properly..
            const user = await Auth.confirmSignUp(authObject.username, confirmationCode);
            console.log('Response:', user);
            setCurrAuthState(authStateConstant.signedIn);
        } catch (error) {
            console.log('error signing in', error);
        }
    };

    return (
        <React.Fragment>
            <img src={fnLogoHorizontal} />
            <form onSubmit={e => e.preventDefault()}>
                <InputLabel htmlFor="email">Confirmation Code:</InputLabel>
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
            <div>
                <div>
                    <Link inputRef="#" onClick={() => setCurrAuthState(authStateConstant.signingUp)}>
                        Don't have an account? Signup
                    </Link>
                </div>
                <div>
                    <Link inputRef="#" onClick={() => setCurrAuthState(authStateConstant.signingIn)}>
                        Already have an account? SignIn
                    </Link>
                </div>
            </div>
        </React.Fragment >
    );
}