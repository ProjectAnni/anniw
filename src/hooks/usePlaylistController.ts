import { useCallback, useRef } from "react";
import usePlayer from "./usePlayer";
import usePlaylist from "./usePlaylist";
import useMessage from "./useMessage";
import { PlaylistItem } from "@/types/common";

export default function usePlayerController() {
    const currentPlayIndex = useRef(0);
    const [player, { play }] = usePlayer();
    const [playlist, { append, insertToSecond, set, clear }] = usePlaylist();
    const [_, { addMessage }] = useMessage();

    const playNext = useCallback(() => {
        if (playlist[currentPlayIndex.current + 1]) {
            currentPlayIndex.current++;
            play(playlist[currentPlayIndex.current]);
        } else if (currentPlayIndex.current === playlist.length - 1) {
            currentPlayIndex.current = 0;
            play(playlist[currentPlayIndex.current]);
        } else {
            addMessage("info", "播放列表播完啦");
        }
    }, [playlist, play, addMessage]);

    const playIndex = useCallback(
        (index: number) => {
            if (playlist[index]) {
                currentPlayIndex.current = index;
                play(playlist[index]);
            }
        },
        [playlist, play]
    );

    const addToLater = useCallback(
        (item: PlaylistItem) => {
            insertToSecond(item);
        },
        [insertToSecond]
    );

    const addToPlaylist = useCallback(
        (item: PlaylistItem | PlaylistItem[]) => {
            if (playlist.length === 0) {
                play(Array.isArray(item) ? item[0] : item);
            }
            append(Array.isArray(item) ? item : [item]);
        },
        [append, play, playlist]
    );

    const replacePlaylist = useCallback(
        (items: PlaylistItem[]) => {
            set(items);
        },
        [set]
    );

    const replacePlaylistAndPlay = useCallback(
        (items: PlaylistItem[], index: number) => {
            play(items[index]);
            set(items);
        },
        [set, play]
    );

    const clearPlaylist = useCallback(() => {
        clear();
    }, [clear]);

    return {
        playNext,
        playIndex,
        addToLater,
        addToPlaylist,
        replacePlaylist,
        replacePlaylistAndPlay,
        clearPlaylist,
    };
}
