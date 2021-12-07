import React from "react";
import { useSetRecoilState } from "recoil";
import {  Grid } from "@material-ui/core";
import { CurrentUserInfo } from "../../state/user";
import { ErrorState } from "../../state/error";
import { login } from "./services";
import LoginForm from "./LoginForm";
import "./index.scss";


function Login() {
    const setCurrentUserInfo = useSetRecoilState(CurrentUserInfo);
    const setErrorState = useSetRecoilState(ErrorState);
    const handleLogin = async (email: string, password: string) => {
        try {
            const userInfo = await login({
                email,
                password,
            });
            setCurrentUserInfo(userInfo);
        } catch (e) {
            if (e instanceof Error) {
                setErrorState({
                    message: e.message,
                    hasError: true,
                });
            }
        }
    };
    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            component="div"
            className="login-form-container"
        >
            <LoginForm handleLogin={handleLogin} />
        </Grid>
    );
}

export default Login;
