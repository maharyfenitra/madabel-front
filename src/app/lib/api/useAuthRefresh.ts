"use client";
import { useAccessToken, useRefreshToken } from ".";
import axiosInstance from "./axiosInstance";
import { URL_CONFIG } from "./configServer";

export const useAuthRefresh = () => {
  const { setAccessToken, removeAccessToken } = useAccessToken();
  const { getRefreshToken, removeRefreshToken } = useRefreshToken();

  const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axiosInstance.post(`${URL_CONFIG.uri}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken } = response.data;
      setAccessToken(accessToken);

      return accessToken;
    } catch (error) {
      // Si le refresh échoue, nettoyer les tokens
      removeAccessToken();
      removeRefreshToken();
      throw error;
    }
  };

  return { refreshAccessToken };
};
