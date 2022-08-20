import React, {
    useEffect,
    useState,
    useImperativeHandle,
    useCallback,
    forwardRef,
    useMemo,
    startTransition,
} from "react";
import { useRecoilValue } from "recoil";
import { keyBy } from "lodash";
import { List } from "@mui/material";
import { PlayQueueItem } from "@/types/common";
import usePlayer from "@/hooks/usePlayer";
import usePlayerController from "@/hooks/usePlayQueueController";
import { CredentialState } from "@/state/credentials";
import {
    getAvailableLibraryForTrack,
    getCoverUrlForTrack,
    getPlayUrlForTrack,
} from "@/utils/library";
import { NormalTrackItem, TrackItem, TrackItemType, TrackListFeatures } from "./types";
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

const isNormalTrack = (track: TrackItem): track is NormalTrackItem =>
    track.itemType === TrackItemType.NORMAL;

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
        tracks = [],
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
            for (const track of tracks.filter<NormalTrackItem>(isNormalTrack)) {
                const credential = await getAvailableLibraryForTrack(track, allCredentials);
                result.push({
                    title: track.title,
                    artist: track.artist,
                    coverUrl: credential && getCoverUrlForTrack(track, credential),
                    playUrl: credential && getPlayUrlForTrack(track, credential),
                    type: track.type,
                    albumId: track.albumId,
                    discId: track.discId,
                    trackId: track.trackId,
                    albumTitle: track.albumTitle,
                    tags: track.tags,
                });
            }
            startTransition(() => {
                setParsedTracks(result);
            });
        })();
    }, [allCredentials, tracks]);
    const parsedTrackMap = useMemo<Record<string, PlayQueueItem>>(() => {
        if (!parsedTracks.length) {
            return {};
        }
        return keyBy(parsedTracks, (track) => `${track.albumId}-${track.discId}-${track.trackId}`);
    }, [parsedTracks]);
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
    const onItemPlay = useCallback(
        (index: number) => {
            onPlay(index);
        },
        [onPlay]
    );
    const onItemPlayQueueAdd = useCallback(
        (index: number) => {
            onPlayQueueAdd && onPlayQueueAdd(parsedTracks[index]);
        },
        [onPlayQueueAdd, parsedTracks]
    );
    const onItemPlayQueueRemove = useCallback(
        (index: number) => {
            onPlayQueueRemove && onPlayQueueRemove(parsedTracks[index]);
        },
        [onPlayQueueRemove, parsedTracks]
    );
    const onItemPlayQueueAddToLater = useCallback(
        (index: number) => {
            onPlayQueueAddToLater && onPlayQueueAddToLater(parsedTracks[index]);
        },
        [onPlayQueueAddToLater, parsedTracks]
    );
    useImperativeHandle(
        ref,
        () => ({ playAll, addAllToPlayQueue, parsedTracks, index: itemIndex }),
        [addAllToPlayQueue, playAll, itemIndex, parsedTracks]
    );
    return (
        <List dense>
            {Object.keys(parsedTrackMap).length !== 0 &&
                tracks.map((track: TrackItem, index) => {
                    switch (track.itemType) {
                        case TrackItemType.NORMAL: {
                            return (
                                <Item
                                    key={`${track.albumId}-${track.discId}-${track.trackId}-${track.title}`}
                                    track={track}
                                    itemIndex={index}
                                    listIndex={itemIndex}
                                    features={features}
                                    onPlay={onItemPlay}
                                    onPlayQueueAdd={onItemPlayQueueAdd}
                                    onPlayQueueRemove={onItemPlayQueueRemove}
                                    onPlayQueueAddToLater={onItemPlayQueueAddToLater}
                                    onPause={pause}
                                    onResume={resume}
                                    onRestart={restart}
                                />
                            );
                        }
                        default: {
                            return null;
                        }
                    }
                })}
        </List>
    );
};

export default forwardRef(TrackList);
