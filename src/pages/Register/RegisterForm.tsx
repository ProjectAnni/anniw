import React, { useState } from "react";
import { useHistory } from "react-router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Grid, TextField } from "@material-ui/core";
import { LoadingButton } from "@mui/lab";
import useMessage from "@/hooks/useMessage";
import { CurrentUserInfo } from "@/state/user";
import { SiteNeedInvitation } from "@/state/site";
import { register } from "../Login/services";

const RegisterForm: React.FC = () => {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [repeatPassword, setRepeatPassword] = React.useState("");
    const [inviteCode, setInviteCode] = React.useState("");
    const [isLoading, setIsLoading] = useState(false);
    const setCurrentUserInfo = useSetRecoilState(CurrentUserInfo);
    const needInvitation = useRecoilValue(SiteNeedInvitation);
    const history = useHistory();
    const [_, { addMessage }] = useMessage();
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
        if (needInvitation && !inviteCode) {
            addMessage("error", "邀请码不能为空");
            return;
        }
        setIsLoading(true);
        try {
            const newUserInfo = await register({
                nickname,
                email,
                password,
                inviteCode,
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
                label="昵称"
                name="nickname"
                fullWidth
                required
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
                required
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
            <TextField
                variant="outlined"
                label="重复密码"
                name="repeatPassword"
                type="password"
                fullWidth
                required
                onChange={(e) => {
                    setRepeatPassword(e.target.value);
                }}
            ></TextField>
            <br />
            {needInvitation && (
                <>
                    <TextField
                        variant="outlined"
                        label="邀请码"
                        name="inviteCode"
                        fullWidth
                        required
                        onChange={(e) => {
                            setInviteCode(e.target.value);
                        }}
                    ></TextField>
                    <br />
                </>
            )}
            <LoadingButton
                color="primary"
                variant="contained"
                sx={{
                    width: "128px",
                }}
                type="submit"
                loading={isLoading}
            >
                注册
            </LoadingButton>
        </Grid>
    );
};

export default RegisterForm;
