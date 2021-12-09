import React, { useState } from "react";
import { useHistory } from "react-router";
import { useSetRecoilState } from "recoil";
import { Grid, TextField } from "@material-ui/core";
import { LoadingButton } from "@mui/lab";
import useMessage from "@/hooks/useMessage";
import { CurrentUserInfo } from "@/state/user";
import { register } from "../Login/services";

const RegisterForm: React.FC = () => {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [repeatPassword, setRepeatPassword] = React.useState("");
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const [_, { addMessage }] = useMessage();
    const setCurrentUserInfo = useSetRecoilState(CurrentUserInfo);
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!password || !repeatPassword) {
            addMessage("error", "密码不能为空");
            return;
        }
        if (!nickname) {
            addMessage("error", "昵称不能为空");
            return;
        }
        if (!email) {
            addMessage("error", "Email不能为空");
            return;
        }
        if (password !== repeatPassword) {
            addMessage("error", "两次输入的密码不一致");
            return;
        }
        setIsLoading(true);
        try {
            const newUserInfo = await register({
                nickname,
                email,
                password,
            });
            setCurrentUserInfo(newUserInfo);
            history.push("/");
        } catch (e) {
            if (e instanceof Error) {
                addMessage("error", e.message);
            }
        } finally {
            setIsLoading(false);
        }
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
                label="Nickname"
                name="nickname"
                fullWidth
                onChange={(e) => {
                    setNickname(e.target.value);
                }}
            ></TextField>
            <br />
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
            <TextField
                variant="outlined"
                label="Repeat Password"
                name="repeatPassword"
                type="password"
                fullWidth
                onChange={(e) => {
                    setRepeatPassword(e.target.value);
                }}
            ></TextField>
            <br />
            <LoadingButton
                color="primary"
                variant="contained"
                sx={{
                    width: "128px",
                }}
                type="submit"
                loading={isLoading}
            >
                Register
            </LoadingButton>
        </Grid>
    );
};

export default RegisterForm;
