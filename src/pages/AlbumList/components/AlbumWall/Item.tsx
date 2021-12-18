import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import useRequest from "@/hooks/useRequest";
import Cover from "@/components/Cover";
import { getAlbumInfo } from "../../services";
import "./index.scss";
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
            className="album-item"
            onClick={() => {
                history.push(`/album/detail?id=${albumId}`);
            }}
        >
            <Cover coverUrl={coverUrl} />
            <div className="album-item-mask">
                <div className="album-item-info">
                    <div className="album-title">{title}</div>
                    <div className="album-artist">{artist}</div>
                </div>
            </div>
        </div>
    );
};

export default AlbumWallItem;
