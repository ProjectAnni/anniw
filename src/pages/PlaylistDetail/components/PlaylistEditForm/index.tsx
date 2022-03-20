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

interface Props {
    open: boolean;
    playlist?: Playlist;
    onCancel: () => void;
}

const PlaylistEditForm: React.FC<Props> = (props) => {
    const { open, playlist, onCancel } = props;
    const {
        name: initialName,
        description: initialDescription,
        isPublic: initialIsPublic,
    } = playlist || {};
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const onSubmit = () => {};
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
                    value={initialName}
                />
                <br />
                <TextField
                    margin="dense"
                    name="playlist_description"
                    label="说明"
                    variant="standard"
                    fullWidth
                    onChange={(e) => setDescription(e.target.value)}
                    value={initialDescription}
                />
                <br />
                <br />
                <FormControlLabel
                    control={
                        <Switch
                            onChange={(e) => {
                                setIsPublic(e.target.checked);
                            }}
                            value={initialIsPublic}
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
