import { Auth } from "aws-amplify";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import PopupContext from "../popup/PopupContext";
import { authState as authStateConstant } from '../shared/constant';
import "./styles.css";

export default () => {
    const { setCurrAuthState } = React.useContext(PopupContext);
    const { register, errors, handleSubmit, watch } = useForm({});
    const password = useRef({});
    password.current = watch("password", "");
    const onSubmit = async data => {
        console.log(JSON.stringify(data));
        const { confirmationCode } = data;
        try {
            // handle this properly..
            const user = await Auth.confirmSignUp('mtreamer333@gmail.com', confirmationCode);

            console.log('RESPONSE:', user);
        } catch (error) {
            console.log('error signing in', error);
        }
    };

    return (
        <React.Fragment>
            <form onSubmit={e => e.preventDefault()}>
                <label htmlFor="email">email</label>
                <input
                    id="confirmationCode"
                    name="confirmationCode"
                    aria-invalid={errors.email ? "true" : "false"}
                    ref={register({
                        required: "required"
                    })}
                />
                {errors.email && <span role="alert">{errors.confirmationCode.message}</span>}
                <input type="submit" onClick={handleSubmit(onSubmit)} />
            </form>
            <div>
                <span><a onClick={() => setCurrAuthState(authStateConstant.signingUp)}>Don't have an account? Signup</a></span>
                <span><a onClick={() => setCurrAuthState(authStateConstant.signingIn)}>Already have an account? SignIn</a></span>
            </div>
        </React.Fragment >
    );
}