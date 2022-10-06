import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import classNames from "classnames";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ListItem, ListItemText, ListItemIcon, IconButton } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";
import useRequest from "@/hooks/useRequest";
import useMessage from "@/hooks/useMessage";
import { CredentialState } from "@/state/credentials";
import { NowPlayingInfoState, PlayerStatusState } from "@/state/player";
import { FavoriteTrackAlbumMap, FavoriteTracksState } from "@/state/favorite";
import { PlayerStatus, PlayQueueItem } from "@/types/common";
import { getAvailableLibraryForTrack } from "@/utils/library";
import { requestIdleCallback } from '@/utils/helper';
import { IsHighlightCheckDoneState } from "./store";
import { addFavorite, removeFavorite } from "./services";
import { TrackListFeatures } from "./types";
import styles from "./index.module.scss";
import ItemActions from "./components/ItemActions";
import ItemSecondaryText from "./components/ItemSecondaryText";

interface Props {
    track: PlayQueueItem;
    itemIndex: number;
    listIndex: number;
    features?: TrackListFeatures[];
    onPlay: (itemIndex: number) => void;
    onPlayQueueAdd: (itemIndex: number) => void;
    onPlayQueueRemove: (itemIndex: number) => void;
    onPlayQueueAddToLater: (itemIndex: number) => void;
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
        listIndex,
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
    const { title, artist, type, albumId, albumTitle, discId, trackId } = track;
    const [searchParams, setSearchParams] = useSearchParams();
    const [isHighlighted, setIsHighlighted] = useState(false);
    const itemContainerRef = useRef<HTMLLIElement>(null);
    const favoriteRequestLock = useRef(false);
    const { credentials: allCredentials } = useRecoilValue(CredentialState);
    const {
        albumId: nowPlayingAlbumId,
        discId: nowPlayingDiscId,
        trackId: nowPlayingTrackId,
    } = useRecoilValue(NowPlayingInfoState);
    const [isHighlightCheckDoneState, setIsHighlightCheckDoneState] =
        useRecoilState(IsHighlightCheckDoneState);
    const playerStatus = useRecoilValue(PlayerStatusState);
    const setFavoriteTracks = useSetRecoilState(FavoriteTracksState);
    const favoriteTrackAlbumMap = useRecoilValue(FavoriteTrackAlbumMap);
    const isFavored =
        favoriteTrackAlbumMap[albumId] &&
        favoriteTrackAlbumMap[albumId].some(
            (item) => item.albumId === albumId && item.discId === discId && item.trackId === trackId
        );
    const isPlaying =
        albumId === nowPlayingAlbumId &&
        discId === nowPlayingDiscId &&
        trackId === nowPlayingTrackId;
    const [credential, loading] = useRequest(() =>
        getAvailableLibraryForTrack(track, allCredentials)
    );
    const [_, { addMessage }] = useMessage();
    const onClickPlayButton = useCallback(() => {
        if (!credential) {
            return;
        }
        if (isPlaying && playerStatus !== PlayerStatus.EMPTY) {
            if (playerStatus === PlayerStatus.PAUSED) {
                onResume();
            } else if (playerStatus === PlayerStatus.PLAYING) {
                onPause();
            } else {
                onRestart();
            }
        } else {
            onPlay(itemIndex);
        }
    }, [credential, isPlaying, itemIndex, onPause, onPlay, onRestart, onResume, playerStatus]);

    const onFavoriteButtonClick = useCallback(async () => {
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
                        (t) => t.albumId !== albumId || t.discId !== discId || t.trackId !== trackId
                    );
                });
            } else {
                setFavoriteTracks((prevTracks) => [
                    {
                        albumId,
                        albumTitle,
                        discId,
                        trackId,
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
        discId,
        isFavored,
        setFavoriteTracks,
        title,
        track,
        trackId,
        type,
    ]);
    const onPlayQueueAddButtonClick = useCallback(() => {
        onPlayQueueAdd(itemIndex);
    }, [itemIndex, onPlayQueueAdd]);
    const onPlayQueueRemoveButtonClick = useCallback(() => {
        onPlayQueueRemove(itemIndex);
    }, [itemIndex, onPlayQueueRemove]);
    const onPlayQueueAddToLaterButtonClick = useCallback(() => {
        onPlayQueueAddToLater(itemIndex);
    }, [itemIndex, onPlayQueueAddToLater]);
    const onDoubleClick = useCallback(() => {
        if (features.includes(TrackListFeatures.DOUBLE_CLICK_TO_HIGHLIGHT)) {
            searchParams.set("highlight", `${listIndex}-${itemIndex}`);
            setIsHighlightCheckDoneState(false);
            setSearchParams(searchParams, {
                replace: true,
            });
        }
    }, [features, itemIndex, listIndex, searchParams, setIsHighlightCheckDoneState, setSearchParams]);
    const secondaryActions = useMemo(
        () => (
            <ItemActions
                features={features}
                resourceUnavailable={!loading && !credential}
                isFavored={isFavored}
                track={track}
                onPlayQueueAdd={onPlayQueueAddButtonClick}
                onPlayQueueRemove={onPlayQueueRemoveButtonClick}
                onPlayQueueAddToLater={onPlayQueueAddToLaterButtonClick}
                onClickFavoriteButton={onFavoriteButtonClick}
            />
        ),
        [
            credential,
            features,
            isFavored,
            loading,
            onFavoriteButtonClick,
            onPlayQueueAddButtonClick,
            onPlayQueueAddToLaterButtonClick,
            onPlayQueueRemoveButtonClick,
            track,
        ]
    );
    useEffect(() => {
        requestIdleCallback(() => {
            const highlight = searchParams.get("highlight");
            if (
                highlight === `${listIndex}-${itemIndex}` &&
                itemContainerRef.current &&
                !isHighlightCheckDoneState
            ) {
                setIsHighlightCheckDoneState(true);
                itemContainerRef.current.scrollIntoView({ block: "center" });
                setTimeout(() => {
                    setIsHighlighted(true);
                }, 300);
            }
        });
    }, [
        isHighlightCheckDoneState,
        itemIndex,
        listIndex,
        searchParams,
        setIsHighlightCheckDoneState,
    ]);
    return (
        <ListItem
            ref={itemContainerRef}
            key={title}
            className={classNames({
                [styles.oddItem]: itemIndex % 2 === 0,
                [styles.highlighted]: isHighlighted,
            })}
            secondaryAction={secondaryActions}
            onDoubleClick={onDoubleClick}
        >
            <ListItemIcon className={styles.playButton}>
                <IconButton onClick={onClickPlayButton} disabled={!loading && !credential}>
                    {isPlaying ? (
                        playerStatus === PlayerStatus.PAUSED ||
                        playerStatus === PlayerStatus.ENDED ||
                        playerStatus === PlayerStatus.EMPTY ||
                        playerStatus === PlayerStatus.BUFFERING ? (
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
                disableTypography
                secondary={<ItemSecondaryText track={track} features={features} />}
                className={styles.textContainer}
            >
                {" "}
            </ListItemText>
        </ListItem>
    );
};

export default memo(TrackListItem);
