import React, { useCallback, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { TrackInfoWithAlbum } from "@/types/common";
import useMessage from "@/hooks/useMessage";
import { CredentialState } from "@/state/credentials";
import ShareDialogTrackList, { TrackListImperativeHandles } from "./components/TrackList";
import { createShareLink } from "./services";
import styles from "./index.module.scss";
import ShareSuccessDialog from "./components/ShareSuccessDialog";

interface Props {
    open: boolean;
    defaultName?: string;
    tracks: TrackInfoWithAlbum[];
    onCancel: () => void;
}

const ShareDialog: React.FC<Props> = (props: Props) => {
    const { open, tracks, defaultName, onCancel } = props;
    const { credentials: allCredentials } = useRecoilValue(CredentialState);
    const trackListRef = useRef<TrackListImperativeHandles>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [shareId, setShareId] = useState("");
    const [isShowShareSuccessDialog, setIsShowShareSuccessDialog] = useState(false);
    const [shareName, setShareName] = useState(defaultName || "");
    const [shareDescription, setShareDescription] = useState("");
    const [_, { addMessage }] = useMessage();
    const onConfirm = useCallback(async () => {
        if (!trackListRef.current) {
            return;
        }
        if (!shareName || !shareDescription) {
            addMessage("error", "请填写完整信息");
            return;
        }
        const tracks = trackListRef.current.getSelectedTracks();
        if (!tracks.length) {
            addMessage("error", "请选择要分享的歌曲");
            return;
        }
        setIsLoading(true);
        try {
            const shareId = await createShareLink({
                name: shareName,
                description: shareDescription,
                cover: { albumId: tracks[0].albumId, discId: tracks[0].discId },
                tracks,
                allCredentials,
            });
            setShareId(shareId);
            setIsShowShareSuccessDialog(true);
        } catch (e) {
            if (e instanceof Error) {
                addMessage("error", e.message);
            }
        } finally {
            setIsLoading(false);
        }
    }, [allCredentials, shareName, shareDescription, addMessage]);
    return (
        <>
            <Dialog open={open} maxWidth="sm" fullWidth onBackdropClick={onCancel}>
                <DialogTitle>分享</DialogTitle>
                <DialogContent>
                    <div className={styles.form}>
                        <TextField
                            margin="dense"
                            name="share_list_name"
                            label="分享名称"
                            variant="standard"
                            defaultValue={defaultName}
                            fullWidth
                            onChange={(e) => setShareName(e.target.value)}
                        />
                        <br />
                        <TextField
                            margin="dense"
                            name="share_list_description"
                            label="分享描述"
                            variant="standard"
                            fullWidth
                            onChange={(e) => setShareDescription(e.target.value)}
                        />
                    </div>
                    <ShareDialogTrackList tracks={tracks} ref={trackListRef} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel}>取消</Button>
                    <LoadingButton loading={isLoading} onClick={onConfirm}>
                        确定
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            <ShareSuccessDialog
                open={isShowShareSuccessDialog}
                shareId={shareId}
                onCancel={() => {
                    setIsShowShareSuccessDialog(false);
                }}
            />
        </>
    );
};

export default ShareDialog;
