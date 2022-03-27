import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { Playlist } from "@/types/common";
import { CurrentUserInfo } from "@/state/user";
import PlaylistEditForm from "../PlaylistEditForm";
import styles from "./index.module.scss";

interface Props {
    playlist?: Playlist;
    onPlaylistInfoUpdate: (playlist: Playlist) => void;
}

const PlaylistInfo: React.FC<Props> = (props) => {
    const { playlist, onPlaylistInfoUpdate } = props;
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
            {!!playlist && (
                <PlaylistEditForm
                    open={isShowPlaylistEditDialog}
                    playlist={playlist}
                    onCancel={() => {
                        setIsShowPlaylistEditDialog(false);
                    }}
                    onSuccess={(playlist) => {
                        setIsShowPlaylistEditDialog(false);
                        onPlaylistInfoUpdate(playlist);
                    }}
                />
            )}
        </Grid>
    );
};

export default PlaylistInfo;
