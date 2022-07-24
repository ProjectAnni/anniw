import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import useMessage from "@/hooks/useMessage";
import { ExportedPlaylist } from "@/types/exported";
import { getShare } from "@/pages/ShareDetail/services";
import { getCoverUrl, parsePlaylists } from "@/pages/ShareDetail/util";
import { PlayerStatus, PlayQueueItem } from "@/types/common";
import { Divider, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import styles from "./index.module.scss";
import Cover from "@/components/Cover";
import { Pause, PlayArrow } from "@mui/icons-material";
import classNames from "classnames";
import usePlayQueueController from "@/hooks/usePlayQueueController";
import { useRecoilValue } from "recoil";
import { NowPlayingInfoState, PlayerStatusState } from "@/state/player";
import usePlayer from "@/hooks/usePlayer";

const TypeTextMap: Record<string, string> = {
    instrumental: "伴奏",
    absolute: "纯音乐",
    drama: "单元剧",
    radio: "广播节目",
    vocal: "纯人声",
};

const ShareDetail = () => {
    const { shareId } = useParams<{ shareId: string | undefined }>();
    const [, { addMessage }] = useMessage();
    const [share, setShare] = useState<ExportedPlaylist | null>(null);
    useEffect(() => {
        if (!shareId) {
            addMessage("error", "请指定分享 ID");
        }
    }, [shareId, addMessage]);
    useEffect(() => {
        if (shareId) {
            (async () => {
                try {
                    setShare(await getShare(shareId));
                } catch (e) {
                    if (e instanceof Error) {
                        addMessage("error", e.message);
                    }
                }
            })();
        }
    }, [shareId, setShare, addMessage]);

    const tracks = useMemo(() => {
        const items: PlayQueueItem[] = [];
        if (share) {
            for (const list of share.songs) {
                items.push(...parsePlaylists(share.metadata, share.tokens, list));
            }
        }
        return items;
    }, [share]);

    const { replacePlayQueueAndPlay } = usePlayQueueController();

    const [, { pause, resume }] = usePlayer();
    const playerStatus = useRecoilValue(PlayerStatusState);
    const {
        albumId: nowPlayingAlbumId,
        discId: nowPlayingDiscId,
        trackId: nowPlayingTrackId,
    } = useRecoilValue(NowPlayingInfoState);

    const isPlaying = useCallback((idx: number) => {
        return nowPlayingAlbumId === tracks[idx].albumId
            && nowPlayingDiscId === tracks[idx].discId
            && nowPlayingTrackId === tracks[idx].trackId;
    }, [tracks, nowPlayingAlbumId, nowPlayingDiscId, nowPlayingTrackId]);

    const handlePlay = (idx: number) => {
        if (isPlaying(idx)) {
            if (playerStatus === PlayerStatus.PLAYING) {
                pause();
            } else {
                resume();
            }
        } else {
            replacePlayQueueAndPlay(tracks, idx);
        }
    };

    return (
        share ?
            <Grid container justifyContent="center" className={styles.pageContainer}>
                <Grid item xs={12} lg={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={3}>
                            <div className={styles.coverContainer}>
                                <Cover coverUrl={getCoverUrl(share)} />
                            </div>
                        </Grid>
                        <Grid item xs={12} lg={9} className={styles.titleContainer}>
                            <div>
                                <Typography variant="h4" className={styles.name}>
                                    <span title={share.name}>{share.name}</span>
                                </Typography>
                            </div>
                            <div className={styles.description}>
                                {!!share.description &&
                                  <Typography variant="subtitle1">{share.description}</Typography>}
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} lg={8} className={styles.divider}>
                    <Divider />
                </Grid>
                <Grid item xs={12} lg={8}>
                    <List dense>
                        {tracks.map((track, idx) => {
                            return (
                                <ListItem
                                    className={classNames({
                                        [styles.oddItem]: idx % 2 === 0,
                                    })}
                                    key={shareId + "-" + idx}>
                                    <ListItemIcon>
                                        <IconButton onClick={() => handlePlay(idx)}>
                                            {isPlaying(idx) ? (
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
                                                    <span>
                                                        {`${(idx + 1).toString().padStart(2, "0")}.`}&nbsp;
                                                    </span>
                                                    <span title={track.title}>{track.title}</span>
                                                </div>
                                                {track.type !== "normal" && (
                                                    <div className={styles.tag}>{TypeTextMap[track.type]}</div>
                                                )}
                                            </div>
                                        }
                                        secondary={
                                            <div>
                                                {track.artist}
                                            </div>
                                        }
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Grid>
            </Grid>
            :
            <>
                <Typography variant="h2">
                    加载中
                </Typography>
            </>
    );
};

export default ShareDetail;
