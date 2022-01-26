import React, { useMemo, memo } from "react";
import { AlbumInfo, AnnilToken } from "@/types/common";
import Cover from "@/components/Cover";
import styles from "./index.module.scss";

interface Props {
    albumInfo?: AlbumInfo;
    credential?: AnnilToken;
}

const AlbumCover: React.FC<Props> = (props) => {
    const { credential, albumInfo } = props;
    const coverUrl = useMemo(() => {
        if (!credential || !albumInfo) {
            return;
        }
        return `${credential.url}/${albumInfo?.albumId}/cover`;
    }, [credential, albumInfo]);
    return (
        <div className={styles.albumCoverContainer}>
            <Cover coverUrl={coverUrl} />
        </div>
    );
};

export default memo(AlbumCover);
