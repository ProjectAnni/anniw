import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Grid, IconButton, Slider, Tooltip } from "@mui/material";
import {
    QueueMusic,
    Repeat,
    RepeatOne,
    Shuffle,
    VolumeOff,
    VolumeUp,
    Favorite,
    FavoriteBorder,
} from "@mui/icons-material";
import { CurrentLoginStatus } from "@/state/user";
import { FavoriteTrackAlbumMap, FavoriteTracksState } from "@/state/favorite";
import { NowPlayingInfoState } from "@/state/player";
import useMessage from "@/hooks/useMessage";
import { LoginStatus } from "@/types/common";
import { addFavorite, removeFavorite } from "@/components/TrackList/services";
import { LoopMode, LoopModeNextMap } from "../../types";
import styles from "./index.module.scss";

interface Props {
    loopMode: LoopMode;
    isMute: boolean;
    currentVolume: number;
    setVolume: (volume: number) => void;
    onChangeLoopMode: (mode: LoopMode) => void;
    onVolumeButtonClick: () => void;
}

const PlayerActions: React.FC<Props> = (props) => {
    const { loopMode, isMute, currentVolume, setVolume, onChangeLoopMode, onVolumeButtonClick } =
        props;
    const navigate = useNavigate();
    const currentLoginStatus = useRecoilValue(CurrentLoginStatus);
    const setFavoriteTracks = useSetRecoilState(FavoriteTracksState);
    const favoriteTrackAlbumMap = useRecoilValue(FavoriteTrackAlbumMap);
    const nowPlayingInfo = useRecoilValue(NowPlayingInfoState);
    const [_, { addMessage }] = useMessage();
    const favoriteRequestLock = useRef(false);
    const { albumId, discId, trackId, tags, type, artist, albumTitle, title } =
        nowPlayingInfo || {};
    const isLogin = currentLoginStatus === LoginStatus.LOGGED_IN;
    const isFavored =
        !!albumId &&
        favoriteTrackAlbumMap[albumId] &&
        favoriteTrackAlbumMap[albumId].some(
            (item) => item.albumId === albumId && item.discId === discId && item.trackId === trackId
        );
    const onClickLoopMode = () => {
        onChangeLoopMode(LoopModeNextMap[loopMode]);
    };
    const onClickFavoriteButton = async () => {
        if (favoriteRequestLock.current || !albumId || !discId || !trackId) {
            return;
        }
        favoriteRequestLock.current = true;
        try {
            await (isFavored
                ? removeFavorite({ albumId, discId, trackId })
                : addFavorite({ albumId, discId, trackId }));
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
                        albumTitle: albumTitle || "",
                        discId,
                        trackId,
                        title: title || "",
                        artist: artist || "",
                        type: type || "normal",
                        tags,
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
    };
    const handleVolumeChange = (e: Event, value: number | number[]) => {
        if (isMute) {
            onVolumeButtonClick();
        }
        setVolume(value as number);
    };
    return (
        <Grid container alignItems="center" className={styles.container}>
            {isLogin && (
                <>
                    {isFavored && (
                        <Tooltip title="取消喜欢">
                            <IconButton color="inherit" onClick={onClickFavoriteButton}>
                                <Favorite />
                            </IconButton>
                        </Tooltip>
                    )}
                    {!isFavored && (
                        <Tooltip title="添加喜欢">
                            <IconButton color="inherit" onClick={onClickFavoriteButton}>
                                <FavoriteBorder />
                            </IconButton>
                        </Tooltip>
                    )}
                </>
            )}
            {loopMode === LoopMode.LIST_LOOP && (
                <Tooltip title="队列循环">
                    <IconButton color="inherit" onClick={onClickLoopMode}>
                        <Repeat />
                    </IconButton>
                </Tooltip>
            )}
            {loopMode === LoopMode.TRACK_LOOP && (
                <Tooltip title="单曲循环">
                    <IconButton color="inherit" onClick={onClickLoopMode}>
                        <RepeatOne />
                    </IconButton>
                </Tooltip>
            )}
            {loopMode === LoopMode.SHUFFLE && (
                <Tooltip title="队列随机">
                    <IconButton color="inherit" onClick={onClickLoopMode}>
                        <Shuffle />
                    </IconButton>
                </Tooltip>
            )}
            <Tooltip title="播放队列">
                <IconButton
                    color="inherit"
                    onClick={() => {
                        navigate("/queue");
                    }}
                >
                    <QueueMusic />
                </IconButton>
            </Tooltip>
            <Tooltip title={isMute ? "解除静音" : "静音"}>
                <IconButton color="inherit" onClick={onVolumeButtonClick}>
                    {isMute ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
            </Tooltip>
            <div className={styles.volumeBarContainer}>
                <Slider
                    value={isMute ? 0 : currentVolume}
                    onChange={handleVolumeChange}
                    valueLabelDisplay="auto"
                    color="secondary"
                />
            </div>
        </Grid>
    );
};

export default PlayerActions;
