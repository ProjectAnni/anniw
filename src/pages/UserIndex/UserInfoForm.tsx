import React, { useState } from "react";
import { CurrentUserInfo } from "@/state/user";
import { useRecoilState } from "recoil";
import { Grid, TextField } from "@mui/material";
import useMessage from "@/hooks/useMessage";
import { LoadingButton } from "@mui/lab";
import { patchIntro } from "./services";

const UserIntroForm = () => {
    const [userInfo, setUserInfo] = useRecoilState(CurrentUserInfo);
    const [nickname, setNickname] = useState(userInfo?.nickname || "");
    const [avatar, setAvatar] = useState(userInfo?.avatar || "");
    const [loading, setLoading] = useState(false);
    const [_, { addMessage }] = useMessage();
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            setUserInfo(await patchIntro({ nickname, avatar }));
        } catch (e) {
            if (e instanceof Error) {
                addMessage("error", e.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} lg={3}>
                <Grid
                    container
                    component="form"
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    onSubmit={onSubmit}
                >
                    <br />
                    <TextField
                        variant="outlined"
                        label="昵称"
                        name="nickname"
                        value={nickname}
                        fullWidth
                        required
                        onChange={(e) => setNickname(e.target.value)}
                    ></TextField>
                    <br />
                    <TextField
                        variant="outlined"
                        label="头像"
                        name="avatar"
                        value={avatar}
                        fullWidth
                        required
                        onChange={(e) => setAvatar(e.target.value)}
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
                        确认修改
                    </LoadingButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default UserIntroForm;
