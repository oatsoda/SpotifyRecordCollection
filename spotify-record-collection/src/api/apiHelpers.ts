import { AxiosResponse } from "axios";

export function processResponseAxios<T>(response: AxiosResponse<T>): Promise<ProcessedResponseOf<T>> {

  return new Promise((resolve, reject) => {
    // will resolve or reject depending on status, will pass both "status" and "data" in either case
    let func: any;
    console.log(`response status: ${response.status}`);
    response.status < 400 ? func = resolve : func = reject;
    func({ ok: response.status >= 200 && response.status < 300, status: response.status, data: response.data });
  });
}

export interface ProcessedResponse {
  ok: boolean, // Whether within 200 range (useful for resolved response which is in 100 or 300)
  status: number;
  data: any
}

export interface ProcessedResponseOf<T> {
  ok: boolean, // Whether within 200 range (useful for resolved response which is in 100 or 300)
  status: number;
  data: T
}