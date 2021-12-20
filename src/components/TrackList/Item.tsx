import React from "react";
import classNames from "classnames";
import { useRecoilValue } from "recoil";
import { ListItem, ListItemText, ListItemIcon, IconButton } from "@material-ui/core";
import { PlayArrow, Pause, PlaylistAdd } from "@material-ui/icons";
import useRequest from "@/hooks/useRequest";
import useMessage from "@/hooks/useMessage";
import { CredentialState } from "@/state/credentials";
import { NowPlayingInfoState, PlayerStatusState } from "@/state/player";
import { AnnilToken, PlayerStatus } from "@/types/common";
import { getAvailableLibraryForTrack } from "./services";
import { TrackItem } from "./types";
import styles from "./index.module.scss";

interface Props {
    track: TrackItem;
    itemIndex: number;
    onPlay: (track: TrackItem, credential?: AnnilToken) => void;
    onPlaylistAdd: (track: TrackItem, credential?: AnnilToken) => void;
    onPause: () => void;
    onResume: () => void;
    onRestart: () => void;
}

const TypeTextMap: Record<string, string> = {
    instrumental: "伴奏",
    absolute: "纯音乐",
    drama: "单元剧",
    radio: "广播节目",
    vocal: "纯人声",
};

const TrackListItem: React.FC<Props> = (props) => {
    const { track, itemIndex, onPlay, onPlaylistAdd, onRestart, onResume, onPause } = props;
    const { title, artist, type, albumId, discIndex, trackIndex } = track;
    const { credentials: allCredentials } = useRecoilValue(CredentialState);
    const {
        albumId: nowPlayingAlbumId,
        discIndex: nowPlayingDiscIndex,
        trackIndex: nowPlayingTrackIndex,
    } = useRecoilValue(NowPlayingInfoState);
    const playerStatus = useRecoilValue(PlayerStatusState);
    const isPlaying =
        albumId === nowPlayingAlbumId &&
        discIndex === nowPlayingDiscIndex &&
        trackIndex === nowPlayingTrackIndex;
    const [_, { addMessage }] = useMessage();
    const [credential, loading] = useRequest(() =>
        getAvailableLibraryForTrack(track, allCredentials)
    );
    const onClickPlayButton = () => {
        if (!loading && !credential) {
            addMessage("error", "无可用音频仓库提供本音频资源");
            return;
        }
        if (!credential) {
            return;
        }
        if (isPlaying) {
            if (playerStatus === PlayerStatus.PAUSED) {
                onResume();
            } else if (playerStatus === PlayerStatus.PLAYING) {
                onPause();
            } else {
                onRestart();
            }
        } else {
            onPlay(track, credential);
        }
    };
    return (
        <ListItem
            key={title}
            className={classNames({
                [styles.oddItem]: itemIndex % 2 === 0,
            })}
            secondaryAction={
                <>
                    <IconButton
                        onClick={() => {
                            onPlaylistAdd(track, credential);
                        }}
                    >
                        <PlaylistAdd />
                    </IconButton>
                </>
            }
        >
            <ListItemIcon className={styles.playButton}>
                <IconButton onClick={onClickPlayButton}>
                    {isPlaying ? (
                        playerStatus === PlayerStatus.PAUSED ||
                        playerStatus === PlayerStatus.ENDED ? (
                            <PlayArrow />
                        ) : (
                            <Pause />
                        )
                    ) : (
                        <PlayArrow />
                    )}
                </IconButton>
            </ListItemIcon>
            <ListItemText
                primary={
                    <div className={styles.titleContainer}>
                        <span>{`${(itemIndex + 1).toString().padStart(2, "0")}. ${title}`}</span>
                        {!!type && type !== "normal" && (
                            <span className={styles.tag}>{TypeTextMap[type]}</span>
                        )}
                    </div>
                }
                secondary={artist}
            >
                {" "}
            </ListItemText>
        </ListItem>
    );
};

export default TrackListItem;
