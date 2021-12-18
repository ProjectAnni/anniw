import React, { useEffect, useState } from "react";
import classNames from "classnames";
import './index.scss'

interface Props {
    coverUrl?: string;
}

const Cover: React.FC<Props> = (props) => {
    const { coverUrl } = props;
    const [isCoverLoaded, setIsCoverLoaded] = useState(false);
    useEffect(() => {
        if (coverUrl) {
            const imgEl = new Image();
            imgEl.src = coverUrl;
            const onLoad = () => {
                setIsCoverLoaded(true);
            };
            imgEl.addEventListener("load", onLoad);
            return () => {
                imgEl.removeEventListener("load", onLoad);
            };
        }
    }, [coverUrl]);
    return (
        <div
            className={classNames("cover", {
                loaded: isCoverLoaded,
            })}
        >
            {isCoverLoaded ? <img src={coverUrl} /> : null}
        </div>
    );
};

export default Cover;
