import axios from "axios";

export const httpClient = axios.create({
  baseURL: "https://api.unsplash.com",
});

httpClient.interceptors.request.use(function (config) {
  config.headers.Authorization = `Client-ID ${process.env.UNSPLASH_CLIENTID}`;
  return config;
});
