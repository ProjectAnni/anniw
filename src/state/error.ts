import { atom } from "recoil";

export const ErrorState = atom({
    key: "ErrorState",
    default: {
        hasError: false,
        message: "",
    },
});
