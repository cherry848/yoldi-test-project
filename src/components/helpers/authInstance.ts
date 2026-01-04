import axios from "axios";
import { getToken } from "./tokenAuth";

const authInstance = axios.create({
  baseURL: "https://frontend-test-api.yoldi.agency/api",
});

// ---- REQUEST INTERCEPTOR ----
authInstance.interceptors.request.use(
  (config) => {
    // Можно добавить токен, если есть
    const token = getToken();
    if (token) config.headers["X-API-Key"] = token;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ---- RESPONSE INTERCEPTOR ----
authInstance.interceptors.response.use(
  (response) => {
    const token = response.data.value;
    if (token) {
      localStorage.setItem("token", token);
    }
    console.log(response);

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authInstance;
