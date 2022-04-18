import React from "react";
import { useRecoilValue } from "recoil";
import { IconButton, List, ListItem, ListItemText } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { PlaylistsState } from "@/state/playlists";
import { PlaylistInfo } from "@/types/playlist";
import { useHistory } from "react-router-dom";

interface Props {
    onDelete: (playlist: PlaylistInfo) => void;
}

const PlaylistList: React.FC<Props> = (props) => {
    const { onDelete } = props;
    const playlists = useRecoilValue(PlaylistsState);
    const history = useHistory();
    const onPlaylistItemClicked = (playlist: PlaylistInfo) => {
        history.push(`/playlist/${playlist.id}`);
    };
    return (
        <List>
            {playlists.map((playlist) => (
                <ListItem
                    button
                    key={playlist.id}
                    secondaryAction={
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(playlist);
                            }}
                        >
                            <Delete />
                        </IconButton>
                    }
                    onClick={() => {
                        onPlaylistItemClicked(playlist);
                    }}
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
