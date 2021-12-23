import React, { useMemo, memo } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { CircularProgress } from "@mui/material";
import useRequest from "@/hooks/useRequest";
import { CredentialState } from "@/state/credentials";
import { getAvailableLibraryForAlbum } from "@/utils/library";
import Cover from "@/components/Cover";
import { getAlbumInfo } from "./services";
import styles from "./index.module.scss";

interface Props {
    albumId: string;
    libraryInfo?: {
        url: string;
        token: string;
    } | null;
}

const AlbumWallItem: React.FC<Props> = (props) => {
    const { albumId, libraryInfo } = props;
    const { credentials: allCredentials } = useRecoilValue(CredentialState);
    const [credential] = useRequest(() =>
        libraryInfo
            ? Promise.resolve(libraryInfo)
            : getAvailableLibraryForAlbum(albumId, allCredentials)
    );
    const { url, token } = credential || {};
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
