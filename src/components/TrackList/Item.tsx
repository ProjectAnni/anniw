import React, { useCallback, useRef } from "react";
import classNames from "classnames";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ListItem, ListItemText, ListItemIcon, IconButton } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";
import useRequest from "@/hooks/useRequest";
import useMessage from "@/hooks/useMessage";
import { CredentialState } from "@/state/credentials";
import { NowPlayingInfoState, PlayerStatusState } from "@/state/player";
import { FavoriteTrackAlbumMap, FavoriteTracksState } from "@/state/favorite";
import { PlayerStatus, PlayQueueItem } from "@/types/common";
import { addFavorite, getAvailableLibraryForTrack, removeFavorite } from "./services";
import { TrackListFeatures } from "./types";
import styles from "./index.module.scss";
import ItemActions from "./ItemActions";

interface Props {
    track: PlayQueueItem;
    itemIndex: number;
    features?: TrackListFeatures[];
    onPlay: () => void;
    onPlayQueueAdd: () => void;
    onPlayQueueRemove: () => void;
    onPlayQueueAddToLater: () => void;
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
        onPlayQueueAddToLater,
        onRestart,
        onResume,
        onPause,
    } = props;
    const { title, artist, type, albumId, albumTitle, discIndex, trackIndex } = track;
    const favoriteRequestLock = useRef(false);
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
    const onClickPlayButton = useCallback(() => {
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
    }, [credential, isPlaying, onPause, onPlay, onRestart, onResume, playerStatus]);

    const onClickFavoriteButton = useCallback(async () => {
        if (favoriteRequestLock.current) {
            return;
        }
        favoriteRequestLock.current = true;
        try {
            await (isFavored ? removeFavorite(track) : addFavorite(track));
            addMessage("success", `${isFavored ? "取消" : "添加"}喜欢成功`);
            if (isFavored) {
                setFavoriteTracks((prevTracks) => {
                    return prevTracks.filter(
                        (t) =>
                            t.albumId !== albumId ||
                            t.discId !== discIndex + 1 ||
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
                        title: title,
                        artist: artist,
                        type: type,
                        tags: track.tags,
                    },
                    ...prevTracks,
                ]);
            }
        } catch (e) {
            if (e instanceof Error) {
                addMessage("error", e.message);
            }
        } finally {
            favoriteRequestLock.current = false;
        }
    }, [
        addMessage,
        albumId,
        albumTitle,
        artist,
        discIndex,
        isFavored,
        setFavoriteTracks,
        title,
        track,
        trackIndex,
        type,
    ]);
    return (
        <ListItem
            key={title}
            className={classNames({
                [styles.oddItem]: itemIndex % 2 === 0,
            })}
            secondaryAction={
                <ItemActions
                    features={features}
                    resourceUnavailable={!loading && !credential}
                    isFavored={isFavored}
                    onPlayQueueAdd={onPlayQueueAdd}
                    onPlayQueueRemove={onPlayQueueRemove}
                    onPlayQueueAddToLater={onPlayQueueAddToLater}
                    onClickFavoriteButton={onClickFavoriteButton}
                />
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
                        <div className={styles.title}>
                            {features.includes(TrackListFeatures.SHOW_TRACK_NO) && (
                                <span>
                                    {`${(itemIndex + 1).toString().padStart(2, "0")}.`}&nbsp;
                                </span>
                            )}
                            <span title={title}>{title}</span>
                        </div>
                        {!!type && type !== "normal" && (
                            <div className={styles.tag}>{TypeTextMap[type]}</div>
                        )}
                    </div>
                }
                secondary={<span className={styles.artist}>{artist}</span>}
                className={styles.textContainer}
            >
                {" "}
            </ListItemText>
        </ListItem>
    );
};

export default TrackListItem;
