import { AnnivError } from "./error";

export interface ResponseBody<T> {
  status: number,
  message?: string,
  data: T
}

export async function handleResponseBody<T>(resp: Response): Promise<T> {
  const body: ResponseBody<T> = await resp.json();
  if (body.status === 0) {
    return body.data;
  } else {
    throw new AnnivError(body.status, body.message);
  }
}