import React, { forwardRef, useImperativeHandle, useCallback, useState } from "react";
import { TrackInfoWithAlbum } from "@/types/common";
import { List, ListSubheader } from "@mui/material";
import ShareDialogTrackItem from "./TrackItem";

interface Props {
    tracks: TrackInfoWithAlbum[];
}

export interface TrackListImperativeHandles {
    getSelectedTracks: () => TrackInfoWithAlbum[];
}

const ShareDialogTrackList: React.ForwardRefRenderFunction<TrackListImperativeHandles, Props> = (
    props: Props,
    ref
) => {
    const { tracks } = props;
    const [checkedIndexes, setCheckedIndexes] = useState(
        (tracks || []).map((track) => `${track.albumId}-${track.discId}-${track.trackId}`)
    );
    const onToggleCheckbox = useCallback(
        (track: TrackInfoWithAlbum) => {
            const { albumId, discId, trackId } = track || {};
            if (checkedIndexes.includes(`${albumId}-${discId}-${trackId}`)) {
                setCheckedIndexes(
                    checkedIndexes.filter((index) => index !== `${albumId}-${discId}-${trackId}`)
                );
            } else {
                setCheckedIndexes([...checkedIndexes, `${albumId}-${discId}-${trackId}`]);
            }
        },
        [checkedIndexes]
    );
    const getSelectedTracks = useCallback(() => {
        return tracks.filter((track) =>
            checkedIndexes.includes(`${track.albumId}-${track.discId}-${track.trackId}`)
        );
    }, [tracks, checkedIndexes]);
    useImperativeHandle(ref, () => ({ getSelectedTracks }), [getSelectedTracks]);
    return (
        <List sx={{ width: "100%", marginTop: "16px" }} dense>
            <ListSubheader>选择分享内容</ListSubheader>
            {tracks.map((track) => (
                <ShareDialogTrackItem
                    track={track}
                    key={track.title}
                    checkedIndexes={checkedIndexes}
                    onToggleCheckbox={onToggleCheckbox}
                />
            ))}
        </List>
    );
};

export default forwardRef(ShareDialogTrackList);
