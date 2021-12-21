import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { AnnilToken } from "@/types/common";
import useMessage from "@/hooks/useMessage";
import { default as LibraryDB } from "@/db/library";
import { default as AlbumDB } from "@/db/album";
import { getLibraryAlbums, getLibraryInfo } from "../../services";

interface Props {
    open: boolean;
    currentLibrary: AnnilToken | null;
    onCancel: () => void;
    onSyncEnded: () => void;
}

const SyncLibraryDialog: React.FC<Props> = (props) => {
    const { open, currentLibrary, onCancel, onSyncEnded } = props;
    const [loading, setLoading] = useState(false);
    const [_, { addMessage }] = useMessage();
    const onConfirm = async () => {
        if (!currentLibrary) {
            return;
        }
        setLoading(true);
        try {
            const libraryInfo = await getLibraryInfo(currentLibrary);
            const { lastUpdate } = libraryInfo;
            const albums = await getLibraryAlbums(currentLibrary);
            if (albums?.length > 0) {
                for (const albumId of albums) {
                    await AlbumDB.addAvailableLibrary(albumId, currentLibrary.url);
                }
            }
            await LibraryDB.set({
                url: currentLibrary.url,
                serverLastUpdate: new Date(lastUpdate * 1000),
                lastSync: new Date(),
                albums: albums?.length ? albums : [],
                albumCount: +albums?.length,
            });
            onSyncEnded();
        } catch (e) {
            if (e instanceof Error) {
                addMessage("error", e.message);
            }
        } finally {
            addMessage("success", "音频仓库同步成功");
            setLoading(false);
        }
    };
    return (
        <Dialog open={open} fullWidth maxWidth="sm" onBackdropClick={onCancel}>
            <DialogTitle>同步音频仓库信息</DialogTitle>
            <DialogContent>
                <p>
                    点击开始，将会下载该音频仓库的以下数据，并建立本地缓存和索引，这可能会耗费一些时间。
                </p>
                <ul>
                    <li>仓库元信息</li>
                    <li>包含的专辑列表</li>
                </ul>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>取消</Button>
                <LoadingButton loading={loading} onClick={onConfirm}>
                    开始
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default SyncLibraryDialog;
