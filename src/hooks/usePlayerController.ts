import { useCallback } from "react";
import usePlayer from "./usePlayer";
import usePlaylist from "./usePlaylist";
import useMessage from "./useMessage";
import { PlaylistItem } from "@/types/common";

export default function usePlayerController() {
    const [player, { play }] = usePlayer();
    const [playlist, { shift, replaceFirst, append, insertToSecond, set, clear }] = usePlaylist();
    const [_, { addMessage }] = useMessage();

    const playNext = useCallback(() => {
        if (playlist.length > 1) {
            play(playlist[1]);
            shift();
        } else {
            addMessage("info", "没有下一首了");
        }
    }, [playlist, play, shift, addMessage]);

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
            addMessage("success", "添加播放列表成功");
        },
        [append, play, playlist, addMessage]
    );

    const playNow = useCallback(
        (item: PlaylistItem) => {
            play(item);
            replaceFirst(item);
        },
        [play, replaceFirst]
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
        addToLater,
        addToPlaylist,
        playNow,
        replacePlaylist,
        replacePlaylistAndPlay,
        clear,
    };
}
