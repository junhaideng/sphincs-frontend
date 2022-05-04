import axios, { AxiosResponse } from "axios";

export interface Cost {
  gen: string;
  sign: string;
  verify: string;
}

interface Signature {
  sk: string;
  pk: string;
  sigma: string;
  cost: Cost;
}

interface Response<T> {
  code: number;
  message: string;
  data: T;
}
export function getSinagure(
  message: string,
  algorithm: string
): Promise<AxiosResponse<Response<Signature>>> {
  const url = import.meta.env.VITE_APP_BACKEND + "/signature/" + algorithm;
  console.log(url);
  return axios.post(
    url,
    {
      message,
      algorithm,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export function getSinagureAlorightmList(): Promise<
  AxiosResponse<Response<Array<string>>>
> {
  const url = import.meta.env.VITE_APP_BACKEND + "/signature/list";
  console.log(url);
  return axios.get(url, {
    timeout: 10000,
  });
}
