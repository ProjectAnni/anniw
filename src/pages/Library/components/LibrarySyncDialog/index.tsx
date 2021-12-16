import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { LoadingButton } from "@mui/lab";

interface Props {
    open: boolean;
    loading: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const LibrarySyncDialog: React.FC<Props> = (props) => {
    const { open, loading, onCancel, onConfirm } = props;

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

export default LibrarySyncDialog;
