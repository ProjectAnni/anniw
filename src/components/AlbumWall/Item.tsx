import React, { useMemo, memo } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { CircularProgress } from "@mui/material";
import useRequest from "@/hooks/useRequest";
import { CredentialState } from "@/state/credentials";
import { getAvailableLibraryForAlbum } from "@/utils/library";
import Cover from "@/components/Cover";
import { AnnilToken } from "@/types/common";
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
    const [credential, loadingToken] = useRequest<{ url: string; token: string } | undefined>(() =>
        libraryInfo
            ? Promise.resolve(libraryInfo)
            : getAvailableLibraryForAlbum(albumId, allCredentials)
    );
    const { url, token } = credential || {};
    const [albumInfo, loading] = useRequest(() => getAlbumInfo(albumId));
    const history = useHistory();
    const { title, artist } = albumInfo || {};
    const coverUrl = useMemo(() => {
        if (!loadingToken && !token) {
            return;
        }
        return `${url}/${albumId}/cover?auth=${token}`;
    }, [albumId, token, url, loadingToken]);

    return (
        <div
            className={styles.item}
            onClick={() => {
                history.push(`/album/${albumId}`);
            }}
        >
            {token && <Cover coverUrl={coverUrl} />}
            {!token && !loadingToken && (
                <div className={styles.unavailable}>
                    资源不可用
                    <br />
                    请尝试同步音频仓库
                </div>
            )}
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
