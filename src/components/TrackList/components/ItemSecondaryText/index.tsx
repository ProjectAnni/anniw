import React, { memo, useState } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { PlayQueueItem } from "@/types/common";
import Artist from "@/components/Artist";
import { TrackListFeatures } from "../../types";
import styles from "./index.module.scss";

interface Props {
    track: PlayQueueItem;
    features: TrackListFeatures[];
}

const ArtistTypeTextMap: Record<string, string> = {
    vocal: "演唱",
    composer: "作曲",
    lyricist: "作词",
    arranger: "编曲",
    piano: "钢琴",
    violin: "小提琴",
    viola: "中提琴",
    cello: "大提琴",
    "irish-harp": "竖琴",
    guitar: "吉他",
};

const ItemSecondaryText: React.FC<Props> = (props) => {
    const { track, features } = props;
    const { artist, artists, albumTitle, albumId } = track;
    const history = useHistory();
    const [isShowDetailedArtists, setIsShowDetailedArtists] = useState(false);
    return (
        <div
            className={classNames(styles.secondaryContainer, {
                [styles.withAlbumTitle]: features.includes(TrackListFeatures.SHOW_ALBUM_INFO),
            })}
        >
            <div
                className={classNames(styles.artist, {
                    [styles.withDetailedArtist]: !!artists && !isShowDetailedArtists,
                })}
                title={artist}
                onClick={() => {
                    !!artists && setIsShowDetailedArtists(true);
                }}
            >
                {!isShowDetailedArtists && <Artist artist={artist} />}
                {!!artists && !isShowDetailedArtists && <span className={styles.arrow} />}
                {!!artists && isShowDetailedArtists && (
                    <div className={styles.detailedArtists}>
                        {Object.entries(artists).map(([key, value]) => (
                            <div key={key}>
                                {ArtistTypeTextMap[key] || key}:&nbsp;
                                <Artist key={key} artist={value} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {features.includes(TrackListFeatures.SHOW_ALBUM_INFO) && (
                <>
                    <div className={styles.divider}> - </div>
                    <div
                        title={albumTitle}
                        className={styles.albumTitle}
                        onClick={() => {
                            history.push("/album/" + albumId);
                        }}
                    >
                        {albumTitle}
                    </div>
                </>
            )}
        </div>
    );
};

export default memo(ItemSecondaryText);
