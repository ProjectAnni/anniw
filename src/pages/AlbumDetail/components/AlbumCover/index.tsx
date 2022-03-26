import React, { useMemo, memo, useState, useEffect } from "react";
import { AlbumInfo, AnnilToken } from "@/types/common";
import Cover from "@/components/Cover";
import styles from "./index.module.scss";

interface Props {
    albumInfo?: AlbumInfo;
    credential?: AnnilToken;
}

const AlbumCover: React.FC<Props> = (props) => {
    const { credential, albumInfo } = props;
    const [isUnavailable, setIsUnavailable] = useState(false);
    const coverUrl = useMemo(() => {
        if (!credential || !albumInfo) {
            return;
        }
        return `${credential.url}/${albumInfo?.albumId}/cover`;
    }, [credential, albumInfo]);
    useEffect(() => {
        if (albumInfo && !credential) {
            setIsUnavailable(true);
        }
    }, [albumInfo, credential]);
    return (
        <div className={styles.albumCoverContainer}>
            {isUnavailable && (
                <div className={styles.unavailableTips}>
                    资源不可用
                    <br />
                    请尝试同步音频仓库
                </div>
            )}
            {!!credential && <Cover coverUrl={coverUrl} />}
        </div>
    );
};

export default memo(AlbumCover);
