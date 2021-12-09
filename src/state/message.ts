import { atom } from "recoil";

export interface MessageItem {
    type: "error" | "success" | "info";
    message: string;
    isShow: boolean;
}

export const MessageState = atom<{ messages: MessageItem[] }>({
    key: "MessageState",
    default: {
        messages: [],
    },
});
