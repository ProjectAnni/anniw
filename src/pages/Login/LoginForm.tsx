import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useHistory } from "react-router";
import { TextField, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useMessage from "@/hooks/useMessage";
import useQuery from "@/hooks/useQuery";
import { CurrentUserInfo } from "@/state/user";
import storage from "@/utils/storage";
import { login } from "./services";
import "./index.scss";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const setCurrentUserInfo = useSetRecoilState(CurrentUserInfo);
    const history = useHistory();
    const query = useQuery();
    const [_, { addMessage }] = useMessage();
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) {
            addMessage("error", "Email/密码不能为空");
            return;
        }
        setIsLoading(true);
        try {
            const userInfo = await login({
                email,
                password,
            });
            setCurrentUserInfo(userInfo);
            storage.set("userInfo", userInfo);
            const returnTo = query.get("return");
            if (returnTo) {
                history.push(returnTo);
            } else {
                history.push("/");
            }
        } catch (e) {
            if (e instanceof Error) {
                addMessage("error", e.message);
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} lg={3}>
                <Grid
                    container
                    component="form"
                    direction="column"
                    alignItems="center"
                    onSubmit={onSubmit}
                >
                    <TextField
                        variant="outlined"
                        label="Email"
                        name="email"
                        required
                        fullWidth
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    ></TextField>
                    <br />
                    <TextField
                        variant="outlined"
                        label="密码"
                        name="password"
                        type="password"
                        fullWidth
                        required
                        onChange={(e) => {
                            setPassword(e.target.value);
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
                        登录
                    </LoadingButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default LoginForm;
