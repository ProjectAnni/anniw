import React, { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import "./index.scss";
import useRequest from "@/hooks/useRequest";
import { getAlbumInfo } from "../../services";

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
    const [isCoverLoaded, setIsCoverLoaded] = useState(false);
    const [albumInfo, loading] = useRequest(() => getAlbumInfo(albumId));
    const history = useHistory();
    const { title, artist } = albumInfo || {};
    const coverUrl = useMemo(() => {
        return `${url}/${albumId}/cover?auth=${token}`;
    }, [albumId, token, url]);
    useEffect(() => {
        const imgEl = new Image();
        imgEl.src = coverUrl;
        imgEl.onload = () => {
            setIsCoverLoaded(true);
        };
    }, [coverUrl]);
    return (
        <div
            className="album-item"
            onClick={() => {
                history.push(`/album/detail?id=${albumId}`);
            }}
        >
            <div
                className={classNames("album-item-cover", {
                    loaded: isCoverLoaded,
                })}
            >
                {isCoverLoaded ? <img src={coverUrl} alt={albumId} /> : null}
            </div>
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
