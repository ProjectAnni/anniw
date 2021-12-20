import React from "react";
import { List } from "@material-ui/core";
import { AnnilToken } from "@/types/common";
import usePlayer from "@/hooks/usePlayer";
import useMessage from "@/hooks/useMessage";
import usePlayerController from "@/hooks/usePlayerController";
import { TrackItem } from "./types";
import { getCoverUrlForTrack, getPlayUrlForTrack } from "./services";
import Item from "./Item";

interface Props {
    tracks: TrackItem[];
}

const TrackList: React.FC<Props> = (props) => {
    const { tracks } = props;
    const [player, { resume, restart, pause }] = usePlayer();
    const { playNow, addToPlaylist } = usePlayerController();
    const [_, { addMessage }] = useMessage();
    const onPlay = (track: TrackItem, credential?: AnnilToken) => {
        if (credential) {
            playNow({
                ...track,
                playUrl: getPlayUrlForTrack(track, credential),
                coverUrl: getCoverUrlForTrack(track, credential),
            });
        }
    };
    const onPlaylistAdd = (track: TrackItem, credential?: AnnilToken) => {
        if (credential) {
            addToPlaylist({
                ...track,
                playUrl: getPlayUrlForTrack(track, credential),
                coverUrl: getCoverUrlForTrack(track, credential),
            });
            addMessage("success", "添加播放列表成功");
        }
    };

    return (
        <List dense>
            {tracks.map((track, index) => {
                return (
                    <Item
                        key={track.title}
                        track={track}
                        itemIndex={index}
                        onPlay={onPlay}
                        onPlaylistAdd={onPlaylistAdd}
                        onPause={pause}
                        onResume={resume}
                        onRestart={restart}
                    />
                );
            })}
        </List>
    );
};

export default TrackList;
