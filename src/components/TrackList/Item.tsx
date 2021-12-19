import React from "react";
import classNames from "classnames";
import { ListItem, ListItemText, ListItemIcon, IconButton } from "@material-ui/core";
import { PlayArrow } from "@material-ui/icons";
import { TrackItem } from "./types";
import styles from "./index.module.scss";

interface Props {
    track: TrackItem;
    itemIndex: number;
    onClick: (track: TrackItem) => void;
}

const TypeTextMap: Record<string, string> = {
    instrumental: "伴奏",
    absolute: "纯音乐",
    drama: "单元剧",
    radio: "广播节目",
    vocal: "纯人声",
};

const TrackListItem: React.FC<Props> = (props) => {
    const { track, itemIndex, onClick } = props;
    const { title, artist, type } = track;
    return (
        <ListItem
            key={title}
            className={classNames({
                [styles.oddItem]: itemIndex % 2 === 0,
            })}
        >
            <ListItemIcon className={styles.playButton}>
                <IconButton
                    onClick={() => {
                        onClick(track);
                    }}
                >
                    <PlayArrow />
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
