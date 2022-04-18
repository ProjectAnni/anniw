import React, { useEffect, useMemo, useState } from "react";
import { Grid, CircularProgress, Typography } from "@mui/material";
import { TrackInfoWithAlbum } from "@/types/common";
import useMessage from "@/hooks/useMessage";
import TrackList from "@/components/TrackList";
import { TrackItem, TrackItemType, TrackListFeatures } from "@/components/TrackList/types";
import { searchTracks } from "../../services";
import styles from "./index.module.scss";

interface Props {
    keyword: string;
}

const TrackSearchResult: React.FC<Props> = (props) => {
    const { keyword } = props;
    const [isSearching, setIsSearching] = useState(false);
    const [isNoResult, setIsNoResult] = useState(false);
    const [trackResult, setTrackResult] = useState<TrackInfoWithAlbum[]>([]);
    const [_, { addMessage }] = useMessage();
    useEffect(() => {
        (async () => {
            setIsSearching(true);
            setTrackResult([]);
            try {
                const { tracks = [] } = await searchTracks({ keyword });
                if (tracks.length === 0) {
                    setIsNoResult(true);
                } else {
                    setIsNoResult(false);
                    setTrackResult(tracks);
                }
            } catch (e) {
                if (e instanceof Error) {
                    addMessage("error", e.message);
                }
            } finally {
                setIsSearching(false);
            }
        })();
    }, [addMessage, keyword]);
    const tracks = useMemo<TrackItem[]>(() => {
        if (!trackResult.length) {
            return [];
        }
        return trackResult.map((track) => ({
            tags: [],
            ...track,
            itemType: TrackItemType.NORMAL,
        }));
    }, [trackResult]);
    return (
        <>
            <TrackList
                tracks={tracks}
                itemIndex={1}
                features={[
                    TrackListFeatures.SHOW_FAVORITE_ICON,
                    TrackListFeatures.SHOW_ADD_TO_PLAYLIST,
                    TrackListFeatures.SHOW_ADD_TO_LATER,
                    TrackListFeatures.SHOW_ALBUM_INFO,
                ]}
            />
            {isSearching && (
                <Grid item xs={12} className={styles.loadingContainer}>
                    <CircularProgress color="inherit" className={styles.loading} />
                </Grid>
            )}
            {!isSearching && isNoResult && (
                <Grid item xs={12} className={styles.noResultContainer}>
                    <Typography variant="body1">无搜索结果</Typography>
                </Grid>
            )}
        </>
    );
};

export default TrackSearchResult;
