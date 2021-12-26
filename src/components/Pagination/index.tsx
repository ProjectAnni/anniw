import React, { ReactElement, useState, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Select, MenuItem, Pagination } from "@mui/material";
import useQuery from "@/hooks/useQuery";

interface Props<T> {
    items: T[];
    children: ({ items }: { items: T[] }) => ReactElement<any, any>;
}

function CommonPagination<T>(props: Props<T>): JSX.Element {
    const { items, children } = props;
    const query = useQuery();
    const history = useHistory();
    const listRef = useRef<HTMLDivElement>(null);
    const [pageNum, setPageNum] = useState<number>(parseInt(query.get("page") || "1"));
    const [itemPerPage, setItemPerPage] = useState<number>(parseInt(query.get("count") || "30"));
    const pageCount = useMemo(
        () => Math.floor(items.length / itemPerPage) + 1,
        [items, itemPerPage]
    );
    const paginatedItems = useMemo(() => {
        const start = (pageNum - 1) * itemPerPage;
        const end = start + itemPerPage;
        return items.slice(start, end);
    }, [items, pageNum, itemPerPage]);
    const onPageCountChange = (count: number) => {
        setItemPerPage(count);
        query.set("page", pageNum.toString());
        query.set("count", count.toString());
        history.replace({
            search: query.toString(),
        });
    };
    const onPageChange = (page: number) => {
        setPageNum(page);
        listRef.current && listRef.current.scrollIntoView();
        query.set("page", page.toString());
        query.set("count", itemPerPage.toString());
        history.replace({
            search: query.toString(),
        });
    };
    return (
        <Grid container ref={listRef}>
            <Grid item xs={12}>
                {children({ items: paginatedItems })}
            </Grid>
            <Grid
                item
                xs={12}
                textAlign="right"
                sx={{
                    margin: "20px 0",
                }}
            >
                <Grid container alignItems="center">
                    <Select
                        label="每页数量"
                        value={itemPerPage}
                        onChange={(e) => {
                            onPageCountChange(+e.target.value);
                        }}
                        size="small"
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                    </Select>
                    <Pagination
                        page={pageNum}
                        count={pageCount}
                        color="primary"
                        onChange={(e, page) => {
                            onPageChange(page);
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default CommonPagination;
