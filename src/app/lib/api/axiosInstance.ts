"use client";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { URL_CONFIG } from "./configServer";

// Variable pour suivre si une requête de refresh est en cours
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Créer une instance axios sans baseURL pour plus de flexibilité
const axiosInstance = axios.create();

// Intercepteur de requête pour ajouter le token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer le refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Si l'erreur est 401 et que ce n'est pas une requête de refresh ou login
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh" &&
      originalRequest.url !== "/auth/login"
    ) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, mettre la requête en file d'attente
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Token ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        // Pas de refresh token, rediriger vers login
        isRefreshing = false;
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }

      try {
        // Tenter de rafraîchir le token
        const response = await axios.post(`${URL_CONFIG.uri}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;

        // Sauvegarder le nouveau access token
        localStorage.setItem("access_token", accessToken);

        // Mettre à jour l'en-tête de la requête originale
        originalRequest.headers.Authorization = `Token ${accessToken}`;

        // Traiter la file d'attente avec le nouveau token
        processQueue(null, accessToken);

        isRefreshing = false;

        // Réessayer la requête originale
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Le refresh a échoué, déconnecter l'utilisateur
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
