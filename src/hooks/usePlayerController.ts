import { useCallback } from "react";
import usePlayer from "./usePlayer";
import usePlaylist from "./usePlaylist";
import useMessage from "./useMessage";
import { PlaylistItem } from "@/types/common";

export default function usePlayerController() {
    const [player, { play }] = usePlayer();
    const [playlist, { shift, replaceFirst, append, insertToSecond, set }] = usePlaylist();
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
        (item: PlaylistItem) => {
            if (playlist.length === 0) {
                play(item);
            }
            append(item);
        },
        [append, play, playlist]
    );

    const playNow = useCallback(
        (item: PlaylistItem) => {
            play(item);
            replaceFirst(item);
        },
        [play, replaceFirst]
    );

    const replacePlaylist = useCallback((items: PlaylistItem[]) => {
        set(items);
    }, [set]);

    return { playNext, addToLater, addToPlaylist, playNow, replacePlaylist };
}
