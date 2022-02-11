import React, { memo, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import axios from "axios";
import styles from "./index.module.scss";

interface Props {
    coverUrl?: string;
    onLoaded?: (url: string) => void;
}

const Cover: React.FC<Props> = (props) => {
    const { coverUrl, onLoaded } = props;
    const prevLoadedCoverUrl = useRef("");
    const [isCoverLoaded, setIsCoverLoaded] = useState(false);
    const [loadedUrl, setLoadedUrl] = useState("");
    useEffect(() => {
        let url: string;
        if (coverUrl) {
            setIsCoverLoaded(false);
            axios.get(coverUrl, { responseType: "arraybuffer" }).then((response) => {
                const data = response.data as ArrayBuffer;
                if (data.byteLength > 0) {
                    const blob = new Blob([response.data], {
                        type: response.headers["content-type"],
                    });
                    url = URL.createObjectURL(blob);
                    prevLoadedCoverUrl.current = coverUrl;
                    setIsCoverLoaded(true);
                    setLoadedUrl(url);
                    onLoaded && onLoaded(url);
                }
            });
        }
        return () => {
            url && URL.revokeObjectURL(url);
        };
    }, [coverUrl, onLoaded]);
    useEffect(() => {
        // coverUrl 变化时销毁之前的 ObjectURL 防止内存泄漏（但愿
        if (prevLoadedCoverUrl && prevLoadedCoverUrl.current !== coverUrl) {
            loadedUrl && URL.revokeObjectURL(loadedUrl);
        }
    }, [coverUrl, loadedUrl]);
    return (
        <div
            className={classNames(styles.cover, {
                [styles.loaded]: isCoverLoaded,
            })}
        >
            {isCoverLoaded ? <img src={loadedUrl} /> : null}
        </div>
    );
};

export default memo(Cover);
