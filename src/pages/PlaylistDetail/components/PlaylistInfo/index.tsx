import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { Playlist } from "@/types/common";
import { CurrentUserInfo } from "@/state/user";
import styles from "./index.module.scss";
import PlaylistEditForm from "../PlaylistEditForm";

interface Props {
    playlist?: Playlist;
}

const PlaylistInfo: React.FC<Props> = (props) => {
    const { playlist } = props;
    const { name, description } = playlist || {};
    const [isShowPlaylistEditDialog, setIsShowPlaylistEditDialog] = useState(false);
    const currentUserInfo = useRecoilValue(CurrentUserInfo);
    const isPlaylistOwner = currentUserInfo?.userId === playlist?.owner;
    if (!playlist) {
        return null;
    }
    return (
        <Grid container flexDirection="column" className={styles.container}>
            <div>
                <Typography variant="h4" className={styles.name}>
                    <span title={name}>{name}</span>
                </Typography>
            </div>
            <div className={styles.description}>
                {!!description && <Typography variant="subtitle1">{description}</Typography>}
            </div>
            {isPlaylistOwner && (
                <div className={styles.actions}>
                    <Tooltip title="编辑播放列表信息">
                        <IconButton
                            onClick={() => {
                                setIsShowPlaylistEditDialog(true);
                            }}
                        >
                            <Edit />
                        </IconButton>
                    </Tooltip>
                </div>
            )}
            <PlaylistEditForm
                open={isShowPlaylistEditDialog}
                playlist={playlist}
                onCancel={() => {
                    setIsShowPlaylistEditDialog(false);
                }}
            />
        </Grid>
    );
};

export default PlaylistInfo;
