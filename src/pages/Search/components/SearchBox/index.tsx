import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Paper, InputBase, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const SearchBox: React.FC = () => {
    const [keyword, setKeyword] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const onSubmit = useCallback(() => {
        searchParams.set("keyword", keyword);
        setSearchParams(searchParams, { replace: true });
    }, [keyword, searchParams, setSearchParams]);
    useEffect(() => {
        const queryKeyword = searchParams.get("keyword");
        if (queryKeyword) {
            setKeyword(queryKeyword);
        }
    }, [searchParams, setKeyword]);
    return (
        <Paper
            component="form"
            sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 600 }}
            onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="搜点啥呢.."
                value={keyword}
                onChange={(e) => {
                    setKeyword(e.target.value);
                }}
            />
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Paper>
    );
};

export default SearchBox;
