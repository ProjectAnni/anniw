import React, { useEffect, useState, useImperativeHandle, useCallback, forwardRef } from "react";
import { useRecoilValue } from "recoil";
import { List } from "@mui/material";
import { PlaylistItem } from "@/types/common";
import usePlayer from "@/hooks/usePlayer";
import usePlayerController from "@/hooks/usePlayerController";
import { CredentialState } from "@/state/credentials";
import { TrackItem } from "./types";
import { getAvailableLibraryForTrack, getCoverUrlForTrack, getPlayUrlForTrack } from "./services";
import Item from "./Item";

interface Props {
    tracks: TrackItem[];
}

export interface TrackListImperativeHandles {
    playAll: () => void;
    addAllToPlaylist: () => void;
    readonly parsedTracks: PlaylistItem[];
}
/**
 * 对外暴露了一些方法 强依赖了渲染次数
 * 增加 re-render 次数后请修改上层 onRef 方法
 * 我劝你还是别 re-render 了 这组件也挺重的
 * English ver: MAGIC, NO NOT CHANGE UNLESS YOU KNOW WHAT YOU ARE DOING
 */
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
    const { tracks } = props;
    const [player, { resume, restart, pause }] = usePlayer();
    const { addToPlaylist, replacePlaylistAndPlay } = usePlayerController();
    const { credentials: allCredentials } = useRecoilValue(CredentialState);
    const [parsedTracks, setParsedTracks] = useState<PlaylistItem[]>([]);
    useEffect(() => {
        (async () => {
            const result: PlaylistItem[] = [];
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
                });
            }
            setParsedTracks(result);
        })();
    }, [allCredentials, tracks]);
    const onPlay = useCallback(
        (index: number) => {
            replacePlaylistAndPlay(parsedTracks.slice(index), 0);
        },
        [parsedTracks, replacePlaylistAndPlay]
    );
    const onPlaylistAdd = useCallback(
        (index: number) => {
            addToPlaylist(parsedTracks[index]);
        },
        [parsedTracks, addToPlaylist]
    );
    const playAll = useCallback(() => {
        replacePlaylistAndPlay(parsedTracks, 0);
    }, [parsedTracks, replacePlaylistAndPlay]);
    const addAllToPlaylist = useCallback(() => {
        addToPlaylist(parsedTracks);
    }, [parsedTracks, addToPlaylist]);
    useImperativeHandle(ref, () => ({ playAll, addAllToPlaylist, parsedTracks }), [
        addAllToPlaylist,
        playAll,
        parsedTracks,
    ]);
    return (
        <List dense>
            {parsedTracks.map((track, index) => {
                return (
                    <Item
                        key={track.title}
                        track={track}
                        itemIndex={index}
                        onPlay={() => {
                            onPlay(index);
                        }}
                        onPlaylistAdd={() => {
                            onPlaylistAdd(index);
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
