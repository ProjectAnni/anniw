import { useEffect, useState, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { ErrorState } from "../state/error";

const useRequest = <T>(queryFunction: () => Promise<T>): [T | undefined, boolean] => {
    const [response, setResponse] = useState<T>();
    const [isLoading, setIsLoading] = useState(false);
    const setErrorState = useSetRecoilState(ErrorState);
    const queryFunctionRef = useRef(queryFunction);
    useEffect(() => {
        setIsLoading(true);
        queryFunctionRef
            .current()
            .then((data) => {
                setResponse(data);
            })
            .catch((e) => {
                setErrorState({
                    hasError: true,
                    message: e.message,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);
    return [response, isLoading];
};

export default useRequest;
