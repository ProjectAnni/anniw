import { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { SiteInfoState } from "@/state/site";

const useTitle = () => {
    const globalSiteInfo = useRecoilValue(SiteInfoState);
    const [title, setTitle] = useState(document.title);
    const { siteName, description } = globalSiteInfo || {};

    useEffect(() => {
        document.title = title;
    }, [title]);

    const updateTitle = useCallback((newTitle: string) => {
        setTitle(newTitle);
    }, []);

    const updateTitleWithSiteName = useCallback(
        (newTitle: string) => {
            setTitle(`${newTitle} | ${siteName}`);
        },
        [siteName]
    );

    const clearTitle = useCallback(() => {
        setTitle(`${siteName}${description ? ` | ${description}` : ""}`);
    }, [siteName, description]);

    return { updateTitle, updateTitleWithSiteName, clearTitle };
};

export default useTitle;
