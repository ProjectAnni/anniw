import React from "react";
import { List } from "@material-ui/core";
import { AnnilToken } from "@/types/common";
import usePlayer from "@/hooks/usePlayer";
import { TrackItem } from "./types";
import Item from "./Item";
import { getAudioUrl, getCoverUrl } from "@/api/annil";

interface Props {
    tracks: TrackItem[];
    credential?: AnnilToken;
}

const TrackList: React.FC<Props> = (props) => {
    const { tracks, credential } = props;
    const [player, { play }] = usePlayer();
    const onClick = (track: TrackItem) => {
        const { title, artist, albumId, albumTitle } = track;

        if (credential) {
            play({
                url: getAudioUrl(credential, track),
                title,
                artist,
                album: albumTitle,
                albumId,
                cover: getCoverUrl(credential, track),
            });
        }
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
