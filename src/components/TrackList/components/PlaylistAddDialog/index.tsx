import React, { memo, useState } from "react";
import { useRecoilValue } from "recoil";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import { Add, PlaylistAdd } from "@mui/icons-material";
import { PlaylistsState } from "@/state/playlists";
import { PlayQueueItem } from "@/types/common";
import useMessage from "@/hooks/useMessage";
import PlaylistCreateDialog from "./PlaylistCreateDialog";
import { addTrackToPlaylist } from "../../services";

interface Props {
    open: boolean;
    track: PlayQueueItem;
    onCancel: () => void;
    onAdded: () => void;
}

const PlaylistAddDialog: React.FC<Props> = (props) => {
    const { open, track, onAdded, onCancel } = props;
    const [isShowCreatePlaylistDialog, setIsShowCreatePlaylistDialog] = useState(false);
    const playlists = useRecoilValue(PlaylistsState);
    const [_, { addMessage }] = useMessage();
    const onItemClicked = async (playlistId: string) => {
        try {
            await addTrackToPlaylist({
                playlistId,
                trackId: {
                    albumId: track.albumId,
                    discId: track.discId,
                    trackId: track.trackId,
                },
            });
            onAdded();
            addMessage("success", "添加成功");
        } catch (e) {
            if (e instanceof Error) {
                addMessage("error", e.message);
            }
        }
    };
    return (
        <Dialog open={open} maxWidth="sm" fullWidth onBackdropClick={onCancel}>
            <DialogTitle>添加到播放列表</DialogTitle>
            <DialogContent>
                <List dense>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                setIsShowCreatePlaylistDialog(true);
                            }}
                        >
                            <ListItemIcon>
                                <Add />
                            </ListItemIcon>
                            <ListItemText>创建播放列表</ListItemText>
                        </ListItemButton>
                    </ListItem>
                    {playlists.map((playlist) => (
                        <ListItem key={playlist.id} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    onItemClicked(playlist.id);
                                }}
                            >
                                <ListItemIcon>
                                    <PlaylistAdd />
                                </ListItemIcon>
                                <ListItemText>{playlist.name}</ListItemText>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <PlaylistCreateDialog
                open={isShowCreatePlaylistDialog}
                onCancel={() => {
                    setIsShowCreatePlaylistDialog(false);
                }}
                onPlaylistCreated={() => {
                    setIsShowCreatePlaylistDialog(false);
                }}
            />
        </Dialog>
    );
};

export default memo(PlaylistAddDialog);
