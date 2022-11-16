import axios from "axios";
import { local } from "./store";

let baseURL = local ? "http://localhost:4000/api" : "/api";

export const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log("axios error");
    console.log(error);
    return error;
  }
);
