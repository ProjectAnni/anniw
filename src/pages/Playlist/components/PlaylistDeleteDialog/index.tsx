import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { PlaylistInfo } from "@/types/playlist";
import useMessage from "@/hooks/useMessage";
import { deletePlaylist } from "../../services";

interface Props {
    open: boolean;
    playlist: PlaylistInfo | null;
    onCancel: () => void;
    onDeleted: () => void;
}

const PlaylistDeleteDialog: React.FC<Props> = (props) => {
    const { open, playlist, onCancel, onDeleted } = props;
    const [loading, setLoading] = useState(false);
    const [, { addMessage }] = useMessage();
    const onConfirm = async () => {
        if (!playlist) {
            return;
        }
        setLoading(true);
        try {
            await deletePlaylist(playlist.id);
            onDeleted();
        } catch (e) {
            if (e instanceof Error) {
                addMessage("error", e.message);
            }
        }
        setLoading(false);
    };
    return (
        <Dialog open={open} maxWidth="xs" fullWidth onBackdropClick={onCancel}>
            <DialogTitle>删除播放列表确认</DialogTitle>
            <DialogActions>
                <Button onClick={onCancel}>取消</Button>
                <LoadingButton loading={loading} onClick={onConfirm}>
                    确认
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default PlaylistDeleteDialog;
