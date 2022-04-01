import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Divider, Grid, Skeleton, Typography } from "@mui/material";
import useMessage from "@/hooks/useMessage";
import usePlayQueueController from "@/hooks/usePlayQueueController";
import { CredentialState } from "@/state/credentials";
import { AlbumInfo, AnnilToken, PlayQueueItem } from "@/types/common";
import TrackList, { TrackListImperativeHandles } from "@/components/TrackList";
import { TrackItem, TrackItemType, TrackListFeatures } from "@/components/TrackList/types";
import AlbumCover from "./components/AlbumCover";
import AlbumBasicInfo from "./components/AlbumBasicInfo";
import { getAlbumInfo } from "./services";
import styles from "./index.module.scss";
import { getAvailableLibraryForTrack } from "@/utils/library";

const AlbumDetail: React.FC = () => {
    const trackListRefs = useRef<TrackListImperativeHandles[]>([]);
    const [_, { addMessage }] = useMessage();
    const { credentials: allAvailableCredentials } = useRecoilValue(CredentialState);
    const [credential, setCredential] = useState<AnnilToken | undefined>(undefined);
    const { id: albumId } = useParams<{ id: string }>();
    const [albumInfo, setAlbumInfo] = useState<AlbumInfo>();
    const { addToPlayQueue, addToLater } = usePlayQueueController();
    useEffect(() => {
        (async () => {
            if (albumId) {
                try {
                    const albumInfoResponse = await getAlbumInfo(albumId);
                    albumInfoResponse && setAlbumInfo(albumInfoResponse);
                } catch (e) {
                    if (e instanceof Error) {
                        addMessage("error", e.message);
                    }
                }
            }
        })();
    }, [albumId, addMessage]);
    useEffect(() => {
        if (!albumId) {
            addMessage("error", "请指定专辑 ID");
            return;
        }
        (async () => {
            const library = await getAvailableLibraryForTrack({ albumId }, allAvailableCredentials);
            if (library) {
                setCredential(library);
            }
        })();
    }, [albumId, allAvailableCredentials, addMessage]);
    const playAll = useCallback(() => {
        if (!trackListRefs.current.length) {
            return;
        }
        trackListRefs.current
            .sort((a, b) => a.index - b.index)
            .forEach((ref, index) => {
                index === 0 ? ref.playAll() : ref.addAllToPlayQueue();
            });
    }, []);
    const onPlayQueueAdd = useCallback(
        (track: PlayQueueItem) => {
            addToPlayQueue(track);
        },
        [addToPlayQueue]
    );
    const onPlayQueueAddToLater = useCallback(
        (track: PlayQueueItem) => {
            addToLater(track);
        },
        [addToLater]
    );
    return (
        <Grid container justifyContent="center" className={styles.pageContainer}>
            <Grid item xs={12} lg={10}>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <AlbumCover albumInfo={albumInfo} credential={credential} />
                    </Grid>
                    <Grid item xs={12} lg={9}>
                        <AlbumBasicInfo albumInfo={albumInfo} onPlayAlbum={playAll} />
                    </Grid>
                </Grid>
                <Grid item xs={12} className={styles.divider}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    {!albumInfo && (
                        <>
                            <Skeleton variant="rectangular" height={32} width="20%" />
                            <div style={{ marginTop: "8px" }}></div>
                            {new Array(10).fill(0).map((_, index) => (
                                <Skeleton
                                    variant="rectangular"
                                    height={62}
                                    sx={{
                                        bgcolor:
                                            index % 2 === 0 ? "rgba(238, 238, 238, 0.2)" : "#fff",
                                    }}
                                    key={index}
                                />
                            ))}
                        </>
                    )}
                    {!!albumInfo?.discs?.length &&
                        albumInfo.discs.map((disc, discIndex) => {
                            const { tracks } = disc;
                            const { albumId, title: albumTitle } = albumInfo;
                            const trackList: TrackItem[] = tracks.map((track, trackIndex) => ({
                                ...track,
                                discId: discIndex + 1,
                                trackId: trackIndex + 1,
                                albumId,
                                albumTitle,
                                itemType: TrackItemType.NORMAL,
                            }));
                            return (
                                <Grid container flexDirection="column" key={disc.catalog}>
                                    <Grid item xs={12}>
                                        <Typography variant="h5">
                                            {`Disc ${discIndex + 1}`}
                                            {disc.title && disc.title !== albumTitle ? ` - ${disc.title}` : ""}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TrackList
                                            tracks={trackList}
                                            itemIndex={discIndex}
                                            ref={(ref) => {
                                                ref?.parsedTracks?.length &&
                                                    !trackListRefs.current.some(
                                                        (r) => r.index === ref.index
                                                    ) &&
                                                    trackListRefs.current.push(ref);
                                            }}
                                            features={[
                                                TrackListFeatures.SHOW_PLAY_QUEUE_ADD_ICON,
                                                TrackListFeatures.SHOW_FAVORITE_ICON,
                                                TrackListFeatures.SHOW_TRACK_NO,
                                                TrackListFeatures.SHOW_ADD_TO_LATER,
                                                TrackListFeatures.SHOW_ADD_TO_PLAYLIST,
                                            ]}
                                            onPlayQueueAdd={onPlayQueueAdd}
                                            onPlayQueueAddToLater={onPlayQueueAddToLater}
                                        />
                                    </Grid>
                                </Grid>
                            );
                        })}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AlbumDetail;
