import React, { useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
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
    const [credential, loadingToken] = useRequest<{ url: string; token: string } | undefined>(() =>
        libraryInfo
            ? Promise.resolve(libraryInfo)
            : getAvailableLibraryForAlbum(albumId, allCredentials)
    );
    const { url, token } = credential || {};
    const [albumInfo, loading] = useRequest(() => getAlbumInfo(albumId));
    const navigate = useNavigate();
    const { title, artist, edition } = albumInfo || {};
    const coverUrl = useMemo(() => {
        return `${url}/${albumId}/cover`;
    }, [albumId, url]);
    return (
        <div
            className={styles.item}
            onClick={() => {
                navigate(`/album/${albumId}`);
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
                    {!!edition && <div className={styles.edition}>{edition}</div>}
                    <div className={styles.title}>{title}</div>
                    <div className={styles.artist}>{artist}</div>
                </div>
            </div>
            {loading && <CircularProgress size="12px" color="inherit" className={styles.loading} />}
        </div>
    );
};

export default memo(AlbumWallItem);
