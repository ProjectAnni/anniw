import React from "react";
import { List } from "@material-ui/core";
import { AnnilToken } from "@/types/common";
import usePlayer from "@/hooks/usePlayer";
import { TrackItem } from "./types";
import Item from "./Item";

interface Props {
    tracks: TrackItem[];
    credential?: AnnilToken;
}

const TrackList: React.FC<Props> = (props) => {
    const { tracks, credential } = props;
    const [player, { play }] = usePlayer();
    const onClick = (track: TrackItem) => {
        const { albumId, albumTitle, discIndex, trackIndex } = track;
        const { title, artist } = track;
        const audioUrl = `${credential?.url}/${albumId}/${discIndex + 1}/${trackIndex + 1}?auth=${
            credential?.token
        }&prefer_bitrate=lossless`;
        const coverUrl = `${credential?.url}/${albumId}/cover?auth=${credential?.token}`;
        play({
            url: audioUrl,
            title,
            artist,
            album: albumTitle,
            albumId,
            cover: coverUrl,
        });
    };
    return (
        <List dense>
            {tracks.map((track, index) => {
                return <Item key={track.title} track={track} itemIndex={index} onClick={onClick} />;
            })}
        </List>
    );
};

export default TrackList;
