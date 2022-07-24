import React from "react";
import { Grid, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useMessage from "@/hooks/useMessage";
import { useState } from "react";
import { changePassword } from "./services";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { CurrentUserInfo } from "@/state/user";

const ChangePasswordForm = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [_, { addMessage }] = useMessage();
    const setUserInfo = useSetRecoilState(CurrentUserInfo);
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newPassword !== repeatPassword) {
            addMessage("error", "两次密码不匹配");
            return;
        }
        setLoading(true);
        try {
            await changePassword({ oldPassword, newPassword });
            setUserInfo(null);
            navigate("/user/login");
        } catch (e) {
            if (e instanceof Error) {
                addMessage("error", e.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <Grid container justifyContent="flex-start">
            <Grid item xs={12} lg={3}>
                <Grid
                    container
                    component="form"
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    onSubmit={onSubmit}
                >
                    <br />
                    <TextField
                        variant="outlined"
                        label="旧密码"
                        name="oldPassword"
                        type="password"
                        value={oldPassword}
                        fullWidth
                        required
                        onChange={(e) => setOldPassword(e.target.value)}
                    ></TextField>
                    <br />
                    <TextField
                        variant="outlined"
                        label="新密码"
                        name="newPassword"
                        type="password"
                        value={newPassword}
                        fullWidth
                        required
                        onChange={(e) => setNewPassword(e.target.value)}
                    ></TextField>
                    <br />
                    <TextField
                        variant="outlined"
                        label="确认新密码"
                        name="repeatPassword"
                        type="password"
                        value={repeatPassword}
                        fullWidth
                        required
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    ></TextField>
                    <br />
                    <LoadingButton
                        color="primary"
                        variant="contained"
                        sx={{
                            width: "128px",
                        }}
                        type="submit"
                        loading={loading}
                    >
                        修改密码
                    </LoadingButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ChangePasswordForm;
