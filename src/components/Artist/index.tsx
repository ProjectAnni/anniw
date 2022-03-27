import React, { useMemo } from "react";
import classNames from "classnames";
import { parseArtists } from "@/utils/helper";
import ArtistItem from "./Item";
import styles from "./index.module.scss";

interface Props {
    artist: string;
    expandDepth?: number;
    className?: string;
}

const Artist: React.FC<Props> = (props) => {
    const { artist, className, expandDepth = Infinity } = props;
    const parsedArtists = useMemo(() => {
        if (!artist) {
            return [];
        }
        return parseArtists(artist);
    }, [artist]);
    return (
        <div className={classNames(styles.artistsContainer, className)}>
            {parsedArtists.map((item, index) => {
                return (
                    <React.Fragment key={item.name}>
                        <ArtistItem artist={item} expandDepth={expandDepth} currentDepth={1} />
                        {index !== parsedArtists.length - 1 && <span>、</span>}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Artist;
