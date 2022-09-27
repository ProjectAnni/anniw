import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Favorite, FavoriteBorder, PlayArrow, Share } from "@mui/icons-material";
import {
    InheritedAlbumDetail,
    InheritedDiscDetail,
    TrackInfo,
    TrackInfoWithAlbum,
} from "@/types/common";
import Tag from "@/components/Tag";
import Artist from "@/components/Artist";
import ShareDialog from "@/components/ShareDialog";
import Placeholder from "./Placeholder";
import styles from "./index.module.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import { FavoriteAlbumsState } from "@/state/favorite";
import {
    addFavoriteAlbum,
    deleteFavoriteAlbum,
    getFavoriteAlbums,
} from "@/components/LoginStatus/services";

interface Props {
    albumInfo?: InheritedAlbumDetail;
    onPlayAlbum: () => void;
}

const AlbumBasicInfo: React.FC<Props> = (props) => {
    const { albumInfo } = props;
    const { title, artist, date, catalog, edition, tags = [] } = albumInfo || {};
    const [isShowShareDialog, setIsShowShareDialog] = useState(false);
    const allTracks = useMemo<TrackInfoWithAlbum[]>(() => {
        const { discs, albumId, title } = albumInfo || {};
        if (!discs?.length || !albumId || !title) {
            return [];
        }
        return discs
            .map((disc: InheritedDiscDetail, discIndex) =>
                disc.tracks.map((track: Required<TrackInfo>, trackIndex) => ({
                    ...track,
                    albumId: albumId,
                    albumTitle: title,
                    discId: discIndex + 1,
                    trackId: trackIndex + 1,
                }))
            )
            .flat();
    }, [albumInfo]);
    const onShareCancel = useCallback(() => {
        setIsShowShareDialog(false);
    }, []);
    const [favoriteAlbums, setFavoriteAlbums] = useRecoilState(FavoriteAlbumsState);
    const isFavoriteAlbum = useMemo(() => {
        if (!albumInfo) return false;
        return favoriteAlbums.indexOf(albumInfo.albumId) !== -1;
    }, [albumInfo, favoriteAlbums]);
    const onToggleFavorite = useCallback(() => {
        if (!albumInfo) return;
        let prom: Promise<unknown>;
        if (isFavoriteAlbum) {
            prom = deleteFavoriteAlbum(albumInfo.albumId);
        } else {
            prom = addFavoriteAlbum(albumInfo.albumId);
        }
        prom.then(() => {
            getFavoriteAlbums().then(setFavoriteAlbums);
        });
    }, [albumInfo, isFavoriteAlbum, setFavoriteAlbums]);
    if (!albumInfo) {
        return <Placeholder />;
    }
    return (
        <Grid container flexDirection="column" className={styles.basicInfoContainer}>
            <Typography variant="h4" className={styles.titleContainer}>
                <span title={title}>{title}</span>
            </Typography>
            <div className={styles.releaseDate}>
                {catalog} / {date}
                {edition ? ` / ${edition}` : ""}
            </div>
            <div className={styles.artist}>{!!artist && <Artist artist={artist} />}</div>
            <div className={styles.tagsContainer}>
                {tags.map((tag) => (
                    <Tag key={tag} tag={tag} />
                ))}
            </div>
            <div className={styles.actions}>
                <Tooltip title={isFavoriteAlbum ? "取消喜欢" : "添加喜欢"}>
                    <IconButton onClick={onToggleFavorite}>
                        {isFavoriteAlbum ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                </Tooltip>
                <Tooltip title="分享">
                    <IconButton
                        onClick={() => {
                            setIsShowShareDialog(true);
                        }}
                    >
                        <Share />
                    </IconButton>
                </Tooltip>
                <Tooltip title="播放全部">
                    <IconButton onClick={props.onPlayAlbum}>
                        <PlayArrow />
                    </IconButton>
                </Tooltip>
            </div>
            <ShareDialog
                open={isShowShareDialog}
                tracks={allTracks}
                defaultName={title}
                onCancel={onShareCancel}
            />
        </Grid>
    );
};

export default memo(AlbumBasicInfo);
