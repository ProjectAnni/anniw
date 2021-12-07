import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { Button, TextField, Grid } from "@material-ui/core";
import { ErrorState } from "../../state/error";
import "./index.scss";

interface Props {
    handleLogin: (email: string, password: string) => Promise<void>;
}

const LoginForm: React.FC<Props> = (props) => {
    const { handleLogin } = props;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const setErrorState = useSetRecoilState(ErrorState);
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) {
            setErrorState({
                message: "Email/密码不能为空",
                hasError: true,
            });
            return;
        }
        handleLogin(email, password);
    };
    return (
        <Grid
            container
            component="form"
            direction="column"
            alignItems="center"
            sx={{
                width: "40%",
            }}
            onSubmit={onSubmit}
        >
            <TextField
                variant="outlined"
                label="Email"
                name="email"
                fullWidth
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
            ></TextField>
            <br />
            <TextField
                variant="outlined"
                label="Password"
                name="password"
                type="password"
                fullWidth
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            ></TextField>
            <br />
            <Button
                color="primary"
                variant="contained"
                sx={{
                    width: "128px",
                }}
                type="submit"
            >
                Login
            </Button>
        </Grid>
    );
};

export default LoginForm;
