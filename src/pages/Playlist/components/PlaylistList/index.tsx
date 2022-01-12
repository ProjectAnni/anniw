import React from "react";
import { useRecoilValue } from "recoil";
import { IconButton, List, ListItem, ListItemText } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { PlaylistsState } from "@/state/playlists";
import { PlaylistInfo } from "@/types/common";

interface Props {
    onDelete: (playlist: PlaylistInfo) => void;
}

const PlaylistList: React.FC<Props> = (props) => {
    const { onDelete } = props;
    const playlists = useRecoilValue(PlaylistsState);
    return (
        <List>
            {playlists.map((playlist) => (
                <ListItem
                    button
                    key={playlist.id}
                    secondaryAction={
                        <IconButton
                            onClick={() => {
                                onDelete(playlist);
                            }}
                        >
                            <Delete />
                        </IconButton>
                    }
                >
                    <ListItemText
                        primary={playlist.name}
                        secondary={playlist.description}
                    ></ListItemText>
                </ListItem>
            ))}
        </List>
    );
};

export default PlaylistList;
