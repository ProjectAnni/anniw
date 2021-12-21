import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useMessage from "@/hooks/useMessage";
import { AnnilToken } from "@/types/common";
import { createAnnilToken } from "../../services";

interface Props {
    open: boolean;
    onCancel: () => void;
    onAdded: (createdAnnilToken: AnnilToken) => void;
}

const AddLibraryDialog: React.FC<Props> = (props) => {
    const { open, onCancel, onAdded } = props;
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [token, setToken] = useState("");
    const [priority, setPriority] = useState(0);
    const [loading, setLoading] = useState(false);
    const [_, { addMessage }] = useMessage();
    const onConfirm = async () => {
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
        if (priority === undefined || priority === null) {
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
        setLoading(true);
        try {
            const createdAnnilToken = await createAnnilToken({
                name,
                url,
                token,
                priority,
            });
            onAdded(createdAnnilToken);
        } catch (e) {
            if (e instanceof Error) {
                addMessage("error", e.message);
            }
        } finally {
            setLoading(false);
        }
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
                    value={0}
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

export default AddLibraryDialog;
