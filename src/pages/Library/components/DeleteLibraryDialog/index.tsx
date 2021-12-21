import React, { useState } from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useMessage from "@/hooks/useMessage";
import { default as LibraryDB } from "@/db/library";
import { default as AlbumDB } from "@/db/album";
import { AnnilToken } from "@/types/common";
import { deleteAnnilToken } from "../../services";

interface Props {
    open: boolean;
    currentLibrary: AnnilToken | null;
    onCancel: () => void;
    onDeleted: (library: AnnilToken) => void;
}

const DeleteLibraryDialog: React.FC<Props> = (props) => {
    const { open, currentLibrary, onCancel, onDeleted } = props;
    const [loading, setLoading] = useState(false);
    const [_, { addMessage }] = useMessage();
    const onConfirm = async () => {
        if (!currentLibrary) {
            return;
        }
        setLoading(true);
        const { id } = currentLibrary;
        try {
            await deleteAnnilToken(id);
            // 删除本地数据
            const currentLocalInfo = await LibraryDB.get(currentLibrary.url);
            await LibraryDB.delete(currentLibrary.url);
            if (currentLocalInfo?.albums?.length) {
                for (const albumId of currentLocalInfo.albums) {
                    await AlbumDB.deleteAvailableLibrary(albumId, currentLibrary.url);
                }
            }
            onDeleted(currentLibrary);
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
            <DialogTitle>确认删除音频仓库</DialogTitle>
            <DialogActions>
                <Button onClick={onCancel}>取消</Button>
                <LoadingButton loading={loading} onClick={onConfirm}>
                    确认
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteLibraryDialog;
