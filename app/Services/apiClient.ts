import Axios from "axios";
import { getItem, setItem } from "./cookieStorage";
import { LOCAL_STORAGE_KEY } from "../constants"

function authRequestInterceptor(config: any) {
  if (config.headers) {
    config.headers.Accept = "application/json";
  } 
  const accessToken = getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    const sessionToken = getItem(LOCAL_STORAGE_KEY.SESSION_TOKEN);
    if (sessionToken) {
      config.headers["x-session-token"] = sessionToken;
    }
  }
  return config;
}

export const api = Axios.create({
  // baseURL: "http://localhost:8080/api/v1",
  baseURL: "https://url-shortener-be.duckdns.org/api/v1",
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => {
    const sessionToken = response.headers["x-session-token"];
    if (sessionToken) {
      setItem(LOCAL_STORAGE_KEY.SESSION_TOKEN, sessionToken);
    }
    return response?.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    // if (error.response?.status === 401) {
    //   if (typeof window !== "undefined") {
    //     const searchParams = new URLSearchParams();
    //     const redirectTo = searchParams.get("redirectTo");
    //     if (redirectTo) {
    //       window.location.href = `/auth/login?redirectTo=${redirectTo}`;
    //     } else {
    //       window.location.href = "/auth/login";
    //     }
    //   }
    // }

    return Promise.reject(error);
  }
);

export function getresponseError(error : any) {
  const isString = typeof error?.response?.data?.message === "string";
  return {
    message: isString
      ? error?.response?.data?.message || "Internal Server Error"
      : "Internal Server Error",
  };
}