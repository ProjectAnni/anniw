import React, { useMemo } from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox } from "@mui/material";
import { TrackInfoWithAlbum } from "@/types/common";
import Artist from "@/components/Artist";
import styles from "./index.module.scss";

interface Props {
    track: TrackInfoWithAlbum;
    checkedIndexes: string[];
    onToggleCheckbox: (track: TrackInfoWithAlbum) => void;
}

const ShareDialogTrackItem: React.FC<Props> = (props: Props) => {
    const { track, checkedIndexes, onToggleCheckbox } = props;
    const { title, albumId, discId, trackId, artist } = track || {};
    const isChecked = useMemo(() => {
        return checkedIndexes.includes(`${albumId}-${discId}-${trackId}`);
    }, [albumId, checkedIndexes, discId, trackId]);
    return (
        <ListItem dense disablePadding disableGutters>
            <ListItemButton
                onClick={() => {
                    onToggleCheckbox(track);
                }}
            >
                <ListItemIcon>
                    <Checkbox checked={isChecked} />
                </ListItemIcon>
                <ListItemText
                    primary={title}
                    secondary={
                        <div className={styles.artistContainer}>
                            <Artist artist={artist} expandDepth={1} />
                        </div>
                    }
                    disableTypography
                />
            </ListItemButton>
        </ListItem>
    );
};

export default ShareDialogTrackItem;
