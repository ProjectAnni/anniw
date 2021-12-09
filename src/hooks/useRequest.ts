import { useEffect, useState, useRef } from "react";
import useMessage from "./useMessage";

const useRequest = <T>(queryFunction: () => Promise<T>): [T | undefined, boolean] => {
    const [response, setResponse] = useState<T>();
    const [isLoading, setIsLoading] = useState(false);
    const [_, { addMessage }] = useMessage();
    const queryFunctionRef = useRef(queryFunction);
    useEffect(() => {
        setIsLoading(true);
        queryFunctionRef
            .current()
            .then((data) => {
                setResponse(data);
            })
            .catch((e) => {
                addMessage("error", e.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);
    return [response, isLoading];
};

export default useRequest;
