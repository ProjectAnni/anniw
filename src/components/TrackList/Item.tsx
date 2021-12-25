import React from "react";
import classNames from "classnames";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ListItem, ListItemText, ListItemIcon, IconButton, Tooltip } from "@mui/material";
import {
    PlayArrow,
    Pause,
    PlaylistAdd,
    PlaylistRemove,
    Favorite,
    FavoriteBorder,
} from "@mui/icons-material";
import useRequest from "@/hooks/useRequest";
import useMessage from "@/hooks/useMessage";
import { CredentialState } from "@/state/credentials";
import { NowPlayingInfoState, PlayerStatusState } from "@/state/player";
import { FavoriteTrackAlbumMap, FavoriteTracksState } from "@/state/favorite";
import { PlayerStatus, PlayQueueItem } from "@/types/common";
import { addFavorite, getAvailableLibraryForTrack, removeFavorite } from "./services";
import { TrackListFeatures } from "./types";
import styles from "./index.module.scss";

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
    const { title, artist, type, albumId, albumTitle, discIndex, trackIndex } = track;
    const { credentials: allCredentials } = useRecoilValue(CredentialState);
    const {
        albumId: nowPlayingAlbumId,
        discIndex: nowPlayingDiscIndex,
        trackIndex: nowPlayingTrackIndex,
    } = useRecoilValue(NowPlayingInfoState);
    const playerStatus = useRecoilValue(PlayerStatusState);
    const setFavoriteTracks = useSetRecoilState(FavoriteTracksState);
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
    const [_, { addMessage }] = useMessage();
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

    const onClickFavoriteButton = async () => {
        try {
            await (isFavored ? removeFavorite(track) : addFavorite(track));
            addMessage("success", `${isFavored ? "取消" : "添加"}喜欢成功`);
            if (isFavored) {
                setFavoriteTracks((prevTracks) => {
                    return prevTracks.filter(
                        (t) =>
                            t.albumId !== albumId &&
                            t.discId !== discIndex + 1 &&
                            t.trackId !== trackIndex + 1
                    );
                });
            } else {
                setFavoriteTracks((prevTracks) => [
                    {
                        albumId,
                        albumTitle,
                        discId: discIndex + 1,
                        trackId: trackIndex + 1,
                        info: {
                            title: title,
                            artist: artist,
                            type: type,
                            tags: track.tags,
                        },
                    },
                    ...prevTracks,
                ]);
            }
        } catch (e) {
            if (e instanceof Error) {
                addMessage("error", e.message);
            }
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
                            <IconButton onClick={onClickFavoriteButton}>
                                <FavoriteBorder />
                            </IconButton>
                        </Tooltip>
                    )}
                    {features.includes(TrackListFeatures.SHOW_FAVORITE_ICON) && isFavored && (
                        <Tooltip title="添加喜欢">
                            <IconButton onClick={onClickFavoriteButton}>
                                <Favorite />
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
