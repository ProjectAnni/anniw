import React from "react";
import classNames from 'classnames';
import { Grid, List, ListItem, ListItemText, Typography } from "@material-ui/core";
import { DiscInfo } from "@/types/common";
import styles from './index.module.scss';

interface Props {
    itemIndex: number;
    disc: DiscInfo;
}

const TrackList: React.FC<Props> = (props) => {
    const { disc, itemIndex } = props;
    const { tracks,  } = disc;
    return (
        <Grid container flexDirection="column">
            <Grid item xs={12}>
                <Typography variant="h5">{`Disc ${itemIndex + 1}`}</Typography>
            </Grid>
            <Grid item xs={12}>
                <List dense>
                    {tracks.map((track, index) => {
                        return (
                            <ListItem key={track.title} className={classNames({
                                [styles.oddItem]: index % 2 === 0,
                            })}>
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
