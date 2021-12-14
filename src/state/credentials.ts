import { atom } from "recoil";
import { AnnilToken } from "@/types/common";

export const CredentialState = atom<{ credentials: AnnilToken[] }>({
    key: "CredentialState",
    default: {
        credentials: [],
    },
});
