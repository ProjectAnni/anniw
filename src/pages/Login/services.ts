import request from "../../api/request";
import { UserInfo } from "../../types/common";
import { sha256 } from "../../utils/crypto";

interface LoginParams {
    email: string;
    password: string;
}

export async function login({ email, password }: LoginParams) {
    return request.post<UserInfo>("/api/user/login", {
        email,
        password: await sha256(password),
    });
}
