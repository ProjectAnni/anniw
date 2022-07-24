import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import useMessage from "@/hooks/useMessage";
import { ExportedPlaylist } from "@/types/exported";
import { getShare } from "@/pages/ShareDetail/services";
import { parsePlaylists } from "@/pages/ShareDetail/util";
import { PlayQueueItem } from "@/types/common";
import { Grid, Typography } from "@mui/material";
import styles from "./index.module.scss";

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
      <Grid container justifyContent="center">
          <Grid container flexDirection="column" className={styles.pageContainer}>
              <div>
                  <Typography variant="h4" className={styles.name}>
                      <span title={share?.name}>{share?.name}</span>
                  </Typography>
              </div>
          </Grid>
      </Grid>
    );
};

export default ShareDetail;
