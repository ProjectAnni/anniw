import { atom, selector } from "recoil";
import { UserInfo } from "@/types/common";

export const CurrentUserInfo = atom<UserInfo | null>({
    key: "CurrentUserInfo",
    default: null,
});

export const IsLogin = selector({
    key: "IsLogin",
    get: ({ get }) => {
        const userInfo = get(CurrentUserInfo);
        return userInfo !== null;
    },
});
