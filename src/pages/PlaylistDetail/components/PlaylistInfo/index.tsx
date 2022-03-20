import React from "react";
import { useRecoilValue } from "recoil";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { Playlist } from "@/types/common";
import { CurrentUserInfo } from "@/state/user";
import styles from "./index.module.scss";

interface Props {
    playlist?: Playlist;
}

const PlaylistInfo: React.FC<Props> = (props) => {
    const { playlist } = props;
    const { name, description } = playlist || {};
    const currentUserInfo = useRecoilValue(CurrentUserInfo);
    const isPlaylistOwner = currentUserInfo?.userId === playlist?.owner;
    if (!playlist) {
        return null;
    }
    return (
        <Grid container flexDirection="column" className={styles.container}>
            <div>
                <Typography variant="h4" className="title">
                    {name}
                </Typography>
            </div>
            <div className={styles.description}>
                {!!description && <Typography variant="subtitle1">{name}</Typography>}
            </div>
            {isPlaylistOwner && (
                <div className={styles.actions}>
                    <Tooltip title="暂未实现">
                        <IconButton>
                            <Edit />
                        </IconButton>
                    </Tooltip>
                </div>
            )}
        </Grid>
    );
};

export default PlaylistInfo;
