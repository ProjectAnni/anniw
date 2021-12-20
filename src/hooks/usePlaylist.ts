import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { PlaylistState } from "@/state/playlist";
import { PlaylistItem } from "@/types/common";

export default function usePlaylist() {
    const [playlist, setPlaylist] = useRecoilState(PlaylistState);

    const append = useCallback(
        (track: PlaylistItem) => {
            setPlaylist((playlist) => [...playlist, track]);
        },
        [setPlaylist]
    );

    const unshift = useCallback(
        (track: PlaylistItem) => {
            setPlaylist((playlist) => [track, ...playlist]);
        },
        [setPlaylist]
    );

    const replaceFirst = useCallback((item: PlaylistItem) => {
        setPlaylist(playlist => [item, ...playlist.slice(1)])
    }, [setPlaylist])

    const insertToSecond = useCallback(
        (track: PlaylistItem) => {
            setPlaylist((playlist) => [...playlist.slice(0, 1), track, ...playlist.slice(1)]);
        },
        [setPlaylist]
    );

    const shift = useCallback(() => {
        setPlaylist((playlist) => playlist.slice(1));
    }, [setPlaylist]);

    const clear = useCallback(() => {
        setPlaylist([]);
    }, [setPlaylist]);

    const set = useCallback(
        (tracks: PlaylistItem[]) => {
            setPlaylist(tracks);
        },
        [setPlaylist]
    );

    return [playlist, { append, unshift, replaceFirst, insertToSecond, shift, clear, set }] as const;
}
