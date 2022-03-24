import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Switch,
    TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Playlist } from "@/types/common";
import useMessage from "@/hooks/useMessage";
import { updatePlaylistInfo } from "../../services";

interface Props {
    open: boolean;
    playlist: Playlist;
    onCancel: () => void;
}

const PlaylistEditForm: React.FC<Props> = (props) => {
    const { open, playlist, onCancel } = props;
    const {
        name: initialName,
        description: initialDescription,
        isPublic: initialIsPublic,
    } = playlist;
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription || "");
    const [isPublic, setIsPublic] = useState(initialIsPublic);
    const [_, { addMessage }] = useMessage();
    const onSubmit = async () => {
        if (!playlist) {
            return;
        }
        setLoading(true);
        try {
            await updatePlaylistInfo({
                id: playlist.id,
                name,
                description,
                isPublic,
            });
            addMessage("success", "修改播放列表信息成功");
            onCancel();
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
            <DialogTitle>修改播放列表信息</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    name="playlist_name"
                    label="名称"
                    variant="standard"
                    fullWidth
                    onChange={(e) => setName(e.target.value)}
                    defaultValue={initialName}
                />
                <br />
                <TextField
                    margin="dense"
                    name="playlist_description"
                    label="说明"
                    variant="standard"
                    fullWidth
                    onChange={(e) => setDescription(e.target.value)}
                    defaultValue={initialDescription}
                />
                <br />
                <br />
                <FormControlLabel
                    control={
                        <Switch
                            onChange={(e) => {
                                setIsPublic(e.target.checked);
                            }}
                            defaultChecked={initialIsPublic}
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

export default PlaylistEditForm;
