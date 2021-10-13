import axios from "axios";

export const httpClient = axios.create({
  baseURL: "https://api.unsplash.com",
});

httpClient.interceptors.request.use(function (config) {
  config.headers.Authorization = `Client-ID ${process.env.UNSPLASH_CLIENTID}`;
  return config;
});

export const preloadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = resolve;
    img.onerror = reject;
  });

export const preloadImages = (arr) => Promise.all(arr.map(preloadImage));

export const saveToLocalStorage = (name, obj) =>
  window.localStorage.setItem(name, JSON.stringify(obj));
