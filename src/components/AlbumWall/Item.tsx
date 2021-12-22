import React, { useMemo, memo } from "react";
import { useHistory } from "react-router-dom";
import useRequest from "@/hooks/useRequest";
import Cover from "@/components/Cover";
import { getAlbumInfo } from "../../pages/AlbumList/services";
import styles from "./index.module.scss";
import { CircularProgress } from "@mui/material";
interface Props {
    albumId: string;
    libraryInfo: {
        url: string;
        token: string;
    } | null;
}

const AlbumWallItem: React.FC<Props> = (props) => {
    const { albumId, libraryInfo } = props;
    const { url, token } = libraryInfo || {};
    const [albumInfo, loading] = useRequest(() => getAlbumInfo(albumId));
    const history = useHistory();
    const { title, artist } = albumInfo || {};
    const coverUrl = useMemo(() => {
        return `${url}/${albumId}/cover?auth=${token}`;
    }, [albumId, token, url]);

    return (
        <div
            className={styles.item}
            onClick={() => {
                history.push(`/album/${albumId}`);
            }}
        >
            <Cover coverUrl={coverUrl} />
            <div className={styles.itemMask}>
                <div className={styles.itemInfo}>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.artist}>{artist}</div>
                </div>
            </div>
            {loading && <CircularProgress size="12px" color="inherit" className={styles.loading} />}
        </div>
    );
};

export default memo(AlbumWallItem);
