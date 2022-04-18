import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    FormControlLabel,
    Switch,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useMessage from "@/hooks/useMessage";
import { PlaylistsState } from "@/state/playlists";
import { createPlaylist } from "../../services";
import { PlaylistInfo } from "@/types/playlist";

interface Props {
    open: boolean;
    onPlaylistCreated: (createdPlaylist: PlaylistInfo) => void;
    onCancel: () => void;
}

const PlaylistCreateDialog: React.FC<Props> = (props) => {
    const { open, onPlaylistCreated, onCancel } = props;
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const setPlaylists = useSetRecoilState(PlaylistsState);
    const [_, { addMessage }] = useMessage();
    const onSubmit = async () => {
        if (!name) {
            return addMessage("error", "请输入播放列表名称");
        }
        setLoading(true);
        try {
            const createdPlaylist = await createPlaylist({
                name,
                description,
                isPublic,
            });
            setPlaylists((playlists) => [...playlists, createdPlaylist]);
            onPlaylistCreated(createdPlaylist);
        } catch (e) {
            if (e instanceof Error) {
                addMessage("error", e.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <Dialog open={open} maxWidth="xs" fullWidth onBackdropClick={onCancel}>
            <DialogTitle>创建播放列表</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    name="playlist_name"
                    label="名称"
                    variant="standard"
                    fullWidth
                    onChange={(e) => setName(e.target.value)}
                />
                <br />
                <TextField
                    margin="dense"
                    name="playlist_description"
                    label="说明"
                    variant="standard"
                    fullWidth
                    onChange={(e) => setDescription(e.target.value)}
                />
                <br />
                <br />
                <FormControlLabel
                    control={
                        <Switch
                            onChange={(e) => {
                                setIsPublic(e.target.checked);
                            }}
                        />
                    }
                    label="是否公开"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>取消</Button>
                <LoadingButton loading={loading} onClick={onSubmit}>
                    确定
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default PlaylistCreateDialog;
