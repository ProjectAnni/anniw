import { useEffect, useState, useRef } from "react";
import useMessage from "./useMessage";

const useRequest = <T>(queryFunction: () => Promise<T>) => {
    const [response, setResponse] = useState<T>();
    const [isLoading, setIsLoading] = useState(true);
    const [_, { addMessage }] = useMessage();
    const queryFunctionRef = useRef(queryFunction);
    useEffect(() => {
        !response && queryFunctionRef
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
    }, [addMessage, response]);
    return [response, isLoading] as const;
};

export default useRequest;
