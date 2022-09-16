import React, { useMemo } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    InputAdornment,
    IconButton,
    Input,
    FormControl,
    InputLabel,
    DialogActions,
} from "@mui/material";
import { ContentCopy, Share } from "@mui/icons-material";
import useMessage from "@/hooks/useMessage";
import styles from "./index.module.scss";

interface Props {
    open: boolean;
    shareId: string;
    onCancel: () => void;
}

const ShareSuccessDialog: React.FC<Props> = (props: Props) => {
    const { open, shareId, onCancel } = props;
    const shareLink = useMemo(() => {
        return `${location.protocol}//${location.host}/#/s/${shareId}`;
    }, [shareId]);
    const [_, { addMessage }] = useMessage();
    const onCopyClick = async () => {
        if (!navigator.clipboard) {
            addMessage("error", "您的浏览器不支持复制功能");
            return;
        }
        try {
            await navigator.clipboard.writeText(shareLink);
            addMessage("success", "复制成功");
        } catch {
            // ignore
        }
    };
    const onShareClick = () => {
        if (!navigator.share) {
            addMessage("error", "您的浏览器不支持分享功能");
            return;
        }
        navigator.share({
            text: shareLink,
        });
    };
    return (
        <Dialog open={open} maxWidth="xs" fullWidth onBackdropClick={onCancel}>
            <DialogTitle>分享成功</DialogTitle>
            <DialogContent>
                <div className={styles.container}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel htmlFor="share_link">分享链接</InputLabel>
                        <Input
                            margin="dense"
                            id="share_link"
                            value={shareLink}
                            fullWidth
                            disabled
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={onCopyClick} size="small">
                                        <ContentCopy />
                                    </IconButton>
                                    <IconButton onClick={onShareClick} size="small">
                                        <Share />
                                    </IconButton>
                                </InputAdornment>
                            }
                        ></Input>
                    </FormControl>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>确定</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareSuccessDialog;
