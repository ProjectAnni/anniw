import React from "react";
import classNames from "classnames";
import {
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Typography,
    IconButton,
} from "@material-ui/core";
import { PlayArrow } from "@material-ui/icons";
import { AlbumInfo, AnnilToken, DiscInfo } from "@/types/common";
import usePlayer from "@/hooks/usePlayer";
import styles from "./index.module.scss";

interface Props {
    itemIndex: number;
    disc: DiscInfo;
    albumInfo?: AlbumInfo;
    credential?: AnnilToken;
}

const TrackList: React.FC<Props> = (props) => {
    const { disc, itemIndex, credential, albumInfo } = props;
    const { tracks } = disc;
    const { albumId } = albumInfo || {};
    const [player, { play }] = usePlayer();
    const onClick = (trackIndex: number) => {
        const audioUrl = `${credential?.url}/${albumId}/${itemIndex + 1}/${trackIndex + 1}?auth=${
            credential?.token
        }&prefer_bitrate=lossless`;
        play(audioUrl);
    };
    return (
        <Grid container flexDirection="column">
            <Grid item xs={12}>
                <Typography variant="h5">{`Disc ${itemIndex + 1}`}</Typography>
            </Grid>
            <Grid item xs={12}>
                <List dense>
                    {tracks.map((track, index) => {
                        return (
                            <ListItem
                                key={track.title}
                                className={classNames({
                                    [styles.oddItem]: index % 2 === 0,
                                })}
                            >
                                <ListItemIcon className={styles.playButton}>
                                    <IconButton
                                        onClick={() => {
                                            onClick(index);
                                        }}
                                    >
                                        <PlayArrow />
                                    </IconButton>
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${(index + 1).toString().padStart(2, "0")}. ${
                                        track.title
                                    }`}
                                    secondary={track.artist}
                                ></ListItemText>
                            </ListItem>
                        );
                    })}
                </List>
            </Grid>
        </Grid>
    );
};

export default TrackList;
