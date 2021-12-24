import React from "react";
import classNames from "classnames";
import { useRecoilValue } from "recoil";
import { ListItem, ListItemText, ListItemIcon, IconButton, Tooltip } from "@mui/material";
import {
    PlayArrow,
    Pause,
    PlaylistAdd,
    PlaylistRemove,
    Favorite,
    FavoriteOutlined,
} from "@mui/icons-material";
import useRequest from "@/hooks/useRequest";
import { CredentialState } from "@/state/credentials";
import { NowPlayingInfoState, PlayerStatusState } from "@/state/player";
import { PlayerStatus, PlayQueueItem } from "@/types/common";
import { getAvailableLibraryForTrack } from "./services";
import { TrackListFeatures } from "./types";
import styles from "./index.module.scss";
import { FavoriteTrackAlbumMap } from "@/state/favorite";

interface Props {
    track: PlayQueueItem;
    itemIndex: number;
    features?: TrackListFeatures[];
    onPlay: () => void;
    onPlayQueueAdd: () => void;
    onPlayQueueRemove: () => void;
    onPause: () => void;
    onResume: () => void;
    onRestart: () => void;
}

const TypeTextMap: Record<string, string> = {
    instrumental: "伴奏",
    absolute: "纯音乐",
    drama: "单元剧",
    radio: "广播节目",
    vocal: "纯人声",
};

const TrackListItem: React.FC<Props> = (props) => {
    const {
        track,
        itemIndex,
        features = [],
        onPlay,
        onPlayQueueAdd,
        onPlayQueueRemove,
        onRestart,
        onResume,
        onPause,
    } = props;
    const { title, artist, type, albumId, discIndex, trackIndex } = track;
    const { credentials: allCredentials } = useRecoilValue(CredentialState);
    const {
        albumId: nowPlayingAlbumId,
        discIndex: nowPlayingDiscIndex,
        trackIndex: nowPlayingTrackIndex,
    } = useRecoilValue(NowPlayingInfoState);
    const playerStatus = useRecoilValue(PlayerStatusState);
    const favoriteTrackAlbumMap = useRecoilValue(FavoriteTrackAlbumMap);
    const isFavored =
        favoriteTrackAlbumMap[albumId] &&
        favoriteTrackAlbumMap[albumId].some(
            (item) =>
                item.albumId === albumId &&
                item.discId === discIndex + 1 &&
                item.trackId === trackIndex + 1
        );
    const isPlaying =
        albumId === nowPlayingAlbumId &&
        discIndex === nowPlayingDiscIndex &&
        trackIndex === nowPlayingTrackIndex;
    const [credential, loading] = useRequest(() =>
        getAvailableLibraryForTrack(track, allCredentials)
    );
    const onClickPlayButton = () => {
        if (!credential) {
            return;
        }
        if (isPlaying) {
            if (playerStatus === PlayerStatus.PAUSED) {
                onResume();
            } else if (playerStatus === PlayerStatus.PLAYING) {
                onPause();
            } else {
                onRestart();
            }
        } else {
            onPlay();
        }
    };

    return (
        <ListItem
            key={title}
            className={classNames({
                [styles.oddItem]: itemIndex % 2 === 0,
            })}
            secondaryAction={
                <>
                    {features.includes(TrackListFeatures.SHOW_PLAY_QUEUE_ADD_ICON) && (
                        <Tooltip title="添加到当前播放队列">
                            <IconButton
                                onClick={() => {
                                    onPlayQueueAdd();
                                }}
                                disabled={!loading && !credential}
                            >
                                <PlaylistAdd />
                            </IconButton>
                        </Tooltip>
                    )}
                    {features.includes(TrackListFeatures.SHOW_PLAY_QUEUE_REMOVE_ICON) && (
                        <Tooltip title="从播放队列移除">
                            <IconButton
                                onClick={() => {
                                    onPlayQueueRemove();
                                }}
                                disabled={!loading && !credential}
                            >
                                <PlaylistRemove />
                            </IconButton>
                        </Tooltip>
                    )}
                    {features.includes(TrackListFeatures.SHOW_FAVORITE_ICON) && !isFavored && (
                        <Tooltip title="添加喜欢">
                            <IconButton onClick={() => {}}>
                                <FavoriteOutlined />
                            </IconButton>
                        </Tooltip>
                    )}
                </>
            }
        >
            <ListItemIcon className={styles.playButton}>
                <IconButton onClick={onClickPlayButton} disabled={!loading && !credential}>
                    {isPlaying ? (
                        playerStatus === PlayerStatus.PAUSED ||
                        playerStatus === PlayerStatus.ENDED ? (
                            <PlayArrow />
                        ) : (
                            <Pause />
                        )
                    ) : (
                        <PlayArrow />
                    )}
                </IconButton>
            </ListItemIcon>
            <ListItemText
                primary={
                    <div className={styles.titleContainer}>
                        <span>{`${(itemIndex + 1).toString().padStart(2, "0")}. ${title}`}</span>
                        {!!type && type !== "normal" && (
                            <span className={styles.tag}>{TypeTextMap[type]}</span>
                        )}
                    </div>
                }
                secondary={artist}
                className={styles.textContainer}
            >
                {" "}
            </ListItemText>
        </ListItem>
    );
};

export default TrackListItem;
