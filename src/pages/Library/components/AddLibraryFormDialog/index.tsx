import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Button,
    TextField,
} from "@material-ui/core";
import { LoadingButton } from "@mui/lab";
import useMessage from "@/hooks/useMessage";
import { AnnilToken } from "@/types/common";

interface Props {
    open: boolean;
    loading: boolean;
    onCancel: () => void;
    onSubmit: ({ name, url, token, priority }: Omit<AnnilToken, "id">) => Promise<void>;
}

const AddLibraryFormDialog: React.FC<Props> = (props) => {
    const { open, loading, onCancel, onSubmit } = props;
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [token, setToken] = useState("");
    const [priority, setPriority] = useState(0);
    const [_, { addMessage }] = useMessage();
    const onConfirm = () => {
        let formattedUrl;
        if (!name) {
            addMessage("error", "名称不能为空");
            return;
        }
        if (!url) {
            addMessage("error", "URL不能为空");
            return;
        }
        if (!token) {
            addMessage("error", "Token不能为空");
            return;
        }
        if (!priority) {
            addMessage("error", "优先级不能为空");
            return;
        }
        try {
            formattedUrl = new URL(url).origin;
        } catch {
            // pass
        }
        if (!formattedUrl) {
            addMessage("error", "URL格式不正确");
            return;
        }
        onSubmit({ name, url: formattedUrl, token, priority });
    };
    return (
        <Dialog open={open} maxWidth="sm" fullWidth onBackdropClick={onCancel}>
            <DialogTitle>添加音频仓库</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    name="library_name"
                    label="名称"
                    variant="standard"
                    fullWidth
                    onChange={(e) => setName(e.target.value)}
                />
                <br />
                <TextField
                    margin="dense"
                    name="library_url"
                    label="URL"
                    variant="standard"
                    fullWidth
                    onChange={(e) => setUrl(e.target.value)}
                />
                <br />
                <TextField
                    margin="dense"
                    name="token"
                    label="Token"
                    variant="standard"
                    fullWidth
                    onChange={(e) => setToken(e.target.value)}
                />
                <br />
                <TextField
                    margin="dense"
                    name="priority"
                    label="优先级"
                    variant="standard"
                    type="number"
                    fullWidth
                    onChange={(e) => setPriority(+e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>取消</Button>
                <LoadingButton loading={loading} onClick={onConfirm}>
                    确定
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default AddLibraryFormDialog;
