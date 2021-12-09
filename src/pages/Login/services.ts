import request from "@/api/request";
import { UserInfo } from "@/types/common";
import { sha256 } from "@/utils/crypto";

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

interface RegisterParams {
    email: string;
    password: string;
    nickname: string;
}

export async function register({ email, password, nickname }: RegisterParams) {
    return request.post<UserInfo>("/api/user/register", {
        email,
        password: await sha256(password),
        nickname,
    });
}
