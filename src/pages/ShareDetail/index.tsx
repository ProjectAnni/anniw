import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import useMessage from "@/hooks/useMessage";
import { ExportedPlaylist } from "@/types/exported";
import { getShare } from "@/pages/ShareDetail/services";
import { getCoverUrl, parsePlaylists } from "@/pages/ShareDetail/util";
import { PlayQueueItem } from "@/types/common";
import { Divider, Grid, List, Typography } from "@mui/material";
import styles from "./index.module.scss";
import Cover from "@/components/Cover";

const ShareDetail = () => {
    const { shareId } = useParams<{ shareId: string | undefined }>();
    const [, { addMessage }] = useMessage();
    const [share, setShare] = useState<ExportedPlaylist | null>(null);
    useEffect(() => {
        if (!shareId) {
            addMessage("error", "请指定分享 ID");
        }
    }, [shareId, addMessage]);
    useEffect(() => {
        if (shareId) {
            (async () => {
                try {
                    setShare(await getShare(shareId));
                } catch (e) {
                    if (e instanceof Error) {
                        addMessage("error", e.message);
                    }
                }
            })();
        }
    }, [shareId, setShare, addMessage]);

    const tracks = useMemo(() => {
        const items: PlayQueueItem[] = [];
        if (share) {
            for (const list of share.songs) {
                items.push(...parsePlaylists(share.metadata, share.tokens, list));
            }
        }
        return items;
    }, [share]);

    return (
        share ?
            <Grid container justifyContent="center" className={styles.pageContainer}>
                <Grid item xs={12} lg={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={3}>
                            <div className={styles.coverContainer}>
                                <Cover coverUrl={getCoverUrl(share)} />
                            </div>
                        </Grid>
                        <Grid item xs={12} lg={9} className={styles.titleContainer}>
                            <div>
                                <Typography variant="h4" className={styles.name}>
                                    <span title={share.name}>{share.name}</span>
                                </Typography>
                            </div>
                            <div className={styles.description}>
                                {!!share.description &&
                                  <Typography variant="subtitle1">{share.description}</Typography>}
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} lg={8} className={styles.divider}>
                    <Divider />
                </Grid>
                <Grid item xs={12} lg={8}>
                    <List dense>

                    </List>
                </Grid>
            </Grid>
            :
            <>
                <Typography variant="h2">
                    加载中
                </Typography>
            </>
    );
};

export default ShareDetail;
