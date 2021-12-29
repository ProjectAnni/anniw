import React, { useMemo, memo } from "react";
import { AlbumInfo, AnnilToken } from "@/types/common";
import Cover from "@/components/Cover";
import "./index.scss";

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
        <div className="album-cover-container">
            <Cover coverUrl={coverUrl} />
        </div>
    );
};

export default memo(AlbumCover);
