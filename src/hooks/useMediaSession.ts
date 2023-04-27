import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { NowPlayingInfoState, PlayerStatusState } from "@/state/player";
import { PlayerStatus } from "@/types/common";

interface Props {
    onNextTrack: () => void;
    onPrevTrack: () => void;
    onPause: () => void;
    onPlay: () => void;
}

const useMediaSession = (props: Props) => {
    const { onNextTrack, onPrevTrack, onPause, onPlay } = props;
    const nowPlayingInfo = useRecoilValue(NowPlayingInfoState);
    const playerStatus = useRecoilValue(PlayerStatusState);

    useEffect(() => {
        if ("mediaSession" in window.navigator) {
            navigator.mediaSession.setActionHandler("play", onPlay);
            navigator.mediaSession.setActionHandler("pause", onPause);
            navigator.mediaSession.setActionHandler("previoustrack", onPrevTrack);
            navigator.mediaSession.setActionHandler("nexttrack", onNextTrack);
            return () => {
                navigator.mediaSession.setActionHandler("play", null);
                navigator.mediaSession.setActionHandler("pause", null);
                navigator.mediaSession.setActionHandler("previoustrack", null);
                navigator.mediaSession.setActionHandler("nexttrack", null);
            };
        }
        return () => undefined;
    }, [onNextTrack, onPause, onPlay, onPrevTrack]);

    useEffect(() => {
        if ("mediaSession" in window.navigator) {
            if (playerStatus === PlayerStatus.PLAYING) {
                navigator.mediaSession.playbackState = "playing";
            } else if (playerStatus === PlayerStatus.PAUSED) {
                navigator.mediaSession.playbackState = "paused";
            }
        }
    }, [playerStatus]);

    useEffect(() => {
        const { title, artist, albumTitle, coverUrl } = nowPlayingInfo || {};
        if (
            "mediaSession" in window.navigator &&
            title &&
            title !== navigator.mediaSession.metadata?.title
        ) {
            window.navigator.mediaSession.metadata = new MediaMetadata({
                title,
                artist,
                album: albumTitle,
                ...(coverUrl
                    ? {
                          artwork: [
                              {
                                  src: coverUrl,
                                  sizes: "512x512",
                                  type: "image/jpeg",
                              },
                          ],
                      }
                    : {}),
            });
        }
    }, [nowPlayingInfo]);
};

export default useMediaSession;
