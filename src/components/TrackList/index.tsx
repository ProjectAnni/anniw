import React, { useEffect, useState, useImperativeHandle, useCallback, forwardRef } from "react";
import { useRecoilValue } from "recoil";
import { List } from "@mui/material";
import { PlayQueueItem } from "@/types/common";
import usePlayer from "@/hooks/usePlayer";
import usePlayerController from "@/hooks/usePlayQueueController";
import { CredentialState } from "@/state/credentials";
import { TrackItem, TrackListFeatures } from "./types";
import { getAvailableLibraryForTrack, getCoverUrlForTrack, getPlayUrlForTrack } from "./services";
import Item from "./Item";

interface Props {
    tracks: TrackItem[];
    itemIndex: number;
    features?: TrackListFeatures[];
    onPlayQueueAdd?: (track: PlayQueueItem) => void;
    onPlayQueueRemove?: (track: PlayQueueItem) => void;
    onPlayQueueAddToLater?: (track: PlayQueueItem) => void;
}

export interface TrackListImperativeHandles {
    playAll: () => void;
    addAllToPlayQueue: () => void;
    readonly index: number;
    readonly parsedTracks: PlayQueueItem[];
}

/**
 * 通用播放列表
 * @param props
 * @param ref
 * @returns
 */
const TrackList: React.ForwardRefRenderFunction<TrackListImperativeHandles, Props> = (
    props,
    ref
) => {
    const {
        tracks,
        itemIndex,
        features = [],
        onPlayQueueAdd,
        onPlayQueueRemove,
        onPlayQueueAddToLater,
    } = props;
    const [player, { resume, restart, pause }] = usePlayer();
    const { addToPlayQueue, replacePlayQueueAndPlay } = usePlayerController();
    const { credentials: allCredentials } = useRecoilValue(CredentialState);
    const [parsedTracks, setParsedTracks] = useState<PlayQueueItem[]>([]);
    useEffect(() => {
        (async () => {
            const result: PlayQueueItem[] = [];
            for (const track of tracks) {
                const credential = await getAvailableLibraryForTrack(track, allCredentials);
                result.push({
                    title: track.title,
                    artist: track.artist,
                    coverUrl: credential && getCoverUrlForTrack(track, credential),
                    playUrl: credential && getPlayUrlForTrack(track, credential),
                    type: track.type,
                    albumId: track.albumId,
                    discIndex: track.discIndex,
                    trackIndex: track.trackIndex,
                    albumTitle: track.albumTitle,
                    tags: track.tags,
                });
            }
            setParsedTracks(result);
        })();
    }, [allCredentials, tracks]);
    const onPlay = useCallback(
        (index: number) => {
            const track = parsedTracks[index];
            const filteredTrack = parsedTracks.filter((t) => !!t.playUrl);
            const indexAfterFiltering = filteredTrack.findIndex((t) => t.playUrl === track.playUrl);
            replacePlayQueueAndPlay(filteredTrack, indexAfterFiltering);
        },
        [parsedTracks, replacePlayQueueAndPlay]
    );
    const playAll = useCallback(() => {
        replacePlayQueueAndPlay(
            parsedTracks.filter((t) => !!t.playUrl),
            0
        );
    }, [parsedTracks, replacePlayQueueAndPlay]);
    const addAllToPlayQueue = useCallback(() => {
        addToPlayQueue(parsedTracks.filter((t) => !!t.playUrl));
    }, [parsedTracks, addToPlayQueue]);
    useImperativeHandle(
        ref,
        () => ({ playAll, addAllToPlayQueue, parsedTracks, index: itemIndex }),
        [addAllToPlayQueue, playAll, itemIndex, parsedTracks]
    );
    return (
        <List dense>
            {parsedTracks.map((track, index) => {
                return (
                    <Item
                        key={`${track.albumId}-${track.discIndex}-${track.trackIndex}-${track.title}`}
                        track={track}
                        itemIndex={index}
                        features={features}
                        onPlay={() => {
                            onPlay(index);
                        }}
                        onPlayQueueAdd={() => {
                            onPlayQueueAdd && onPlayQueueAdd(parsedTracks[index]);
                        }}
                        onPlayQueueRemove={() => {
                            onPlayQueueRemove && onPlayQueueRemove(parsedTracks[index]);
                        }}
                        onPlayQueueAddToLater={() => {
                            onPlayQueueAddToLater && onPlayQueueAddToLater(parsedTracks[index]);
                        }}
                        onPause={pause}
                        onResume={resume}
                        onRestart={restart}
                    />
                );
            })}
        </List>
    );
};

export default forwardRef(TrackList);
