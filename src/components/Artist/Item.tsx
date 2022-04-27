import React, { useState } from "react";
import classNames from "classnames";
import { Artist } from "@/utils/helper";
import styles from "./index.module.scss";

interface Props {
    artist: Artist;
    currentDepth: number;
    expandDepth: number;
}

const ArtistItem: React.FC<Props> = (props) => {
    const { artist, expandDepth, currentDepth } = props;
    const [isShowChildren, setIsShowChildren] = useState(artist.children.length <= 1);
    const canShowChildren = artist.children.length > 0 && currentDepth < expandDepth;
    return (
        <>
            <span
                className={classNames({
                    [styles.folded]: !isShowChildren && canShowChildren,
                })}
                onClick={(e) => {
                    canShowChildren && !isShowChildren && e.stopPropagation();
                    setIsShowChildren(true);
                }}
            >
                {artist.name}
            </span>
            {isShowChildren && canShowChildren && (
                <>
                    <span className={styles.brackets}>[</span>
                    {artist.children.map((item, index) => (
                        <React.Fragment key={item.name}>
                            <ArtistItem
                                artist={item}
                                expandDepth={expandDepth}
                                currentDepth={currentDepth + 1}
                            />
                            {index !== artist.children.length - 1 && (
                                <span className={styles.divider}> · </span>
                            )}
                        </React.Fragment>
                    ))}
                    <span className={styles.brackets}>]</span>
                </>
            )}
        </>
    );
};

export default ArtistItem;
