import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { groupBy } from "lodash";
import { Divider, Grid, Typography } from "@mui/material";
import useMessage from "@/hooks/useMessage";
import useRequest from "@/hooks/useRequest";
import usePlayQueueController from "@/hooks/usePlayQueueController";
import { CredentialState } from "@/state/credentials";
import { AlbumInfo, AnnilToken, PlayQueueItem } from "@/types/common";
import TrackList, { TrackListImperativeHandles } from "@/components/TrackList";
import { TrackItem, TrackListFeatures } from "@/components/TrackList/types";
import AlbumCover from "./components/AlbumCover";
import AlbumBasicInfo from "./components/AlbumBasicInfo";
import { getAlbumInfo, getAlbumAvailableLibraries } from "./services";
import styles from "./index.module.scss";

const AlbumDetail: React.FC = () => {
    const trackListRefs = useRef<TrackListImperativeHandles[]>([]);
    const [_, { addMessage }] = useMessage();
    const { credentials: allAvailableCredentials } = useRecoilValue(CredentialState);
    const [credential, setCredential] = useState<AnnilToken | undefined>(undefined);
    const { id: albumId } = useParams<{ id: string }>();
    const [availableLibraries, loadingAvailableLibraries] = useRequest(() =>
        getAlbumAvailableLibraries(albumId)
    );
    const [albumInfo, setAlbumInfo] = useState<AlbumInfo | undefined>();
    const { addToPlayQueue } = usePlayQueueController();
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
        if (!allAvailableCredentials?.length) {
            addMessage("error", "无可用音频仓库");
            return;
        }
        if (!availableLibraries?.length) {
            !loadingAvailableLibraries && addMessage("error", "无可提供该专辑资源的音频后端");
            return;
        }
        const credentialUrlMap = groupBy(allAvailableCredentials, "url");
        const librariesByPriority = availableLibraries.sort(
            (a, b) => credentialUrlMap[b][0].priority - credentialUrlMap[a][0].priority
        );
        setCredential(credentialUrlMap[librariesByPriority[0]][0]);
    }, [
        albumId,
        allAvailableCredentials,
        availableLibraries,
        loadingAvailableLibraries,
        addMessage,
    ]);
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
    return (
        <Grid container justifyContent="center" className={styles.pageContainer}>
            <Grid item xs={12} lg={8}>
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
                    {!!albumInfo?.discs?.length &&
                        albumInfo.discs.map((disc, discIndex) => {
                            const { tracks } = disc;
                            const { albumId, title: albumTitle } = albumInfo;
                            const trackList: TrackItem[] = tracks.map((track, trackIndex) => ({
                                ...track,
                                discIndex,
                                trackIndex,
                                albumId,
                                albumTitle,
                            }));
                            return (
                                <Grid container flexDirection="column" key={disc.catalog}>
                                    <Grid item xs={12}>
                                        <Typography variant="h5">{`Disc ${
                                            discIndex + 1
                                        }`}</Typography>
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
                                            ]}
                                            onPlayQueueAdd={onPlayQueueAdd}
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
