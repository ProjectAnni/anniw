import React, { useState, useEffect, useMemo } from "react";
import { List, Box } from "@mui/material";
import { default as LibraryDB } from "@/db/library";
import { AnnilToken } from "@/types/common";
import { AnnilTokenLocalInfo } from "../../types";
import LibraryListItem from "./Item";
interface Props {
    libraries: AnnilToken[];
    localInfoRefreshIndicator: number;
    onClick: (library: AnnilToken) => void;
    onSync: (library: AnnilToken) => void;
    onDelete: (library: AnnilToken) => void;
}

const LibraryList: React.FC<Props> = (props) => {
    const { libraries, localInfoRefreshIndicator, onClick, onDelete, onSync } = props;
    const [localLibraryInfo, setLocalLibraryInfo] = useState<
        (AnnilToken & AnnilTokenLocalInfo)[] | null
    >(null);
    const librariesWithLocalInfo = useMemo<(AnnilToken & AnnilTokenLocalInfo)[]>(() => {
        if (!libraries?.length) {
            return [];
        }
        if (!localLibraryInfo) {
            return libraries;
        }

        return localLibraryInfo;
    }, [libraries, localLibraryInfo]);
    useEffect(() => {
        (async () => {
            if (!libraries?.length) {
                return;
            }
            const result: (AnnilToken & AnnilTokenLocalInfo)[] = [];
            for (const library of libraries) {
                const localLibraryInfo = await LibraryDB.get(library.url);
                result.push(localLibraryInfo ? { ...library, ...localLibraryInfo } : library);
            }
            setLocalLibraryInfo(result);
        })();
    }, [libraries, localInfoRefreshIndicator]);
    if (!librariesWithLocalInfo?.length) {
        return null;
    }
    return (
        <Box>
            <List>
                {librariesWithLocalInfo.map((library) => {
                    return (
                        <LibraryListItem
                            key={library.id}
                            library={library}
                            onClick={onClick}
                            onSync={onSync}
                            onDelete={onDelete}
                        />
                    );
                })}
            </List>
        </Box>
    );
};

export default LibraryList;
