"use client";

export const useRefreshToken = () => {
  const isBrowser = typeof window !== "undefined";

  const setRefreshToken = (token: string) => {
    if (isBrowser) {
      localStorage.setItem("refresh_token", token);
    }
  };

  const getRefreshToken = () => {
    if (isBrowser) {
      return localStorage.getItem("refresh_token");
    }
    return null;
  };

  const removeRefreshToken = () => {
    if (isBrowser) {
      localStorage.removeItem("refresh_token");
    }
  };

  return {
    setRefreshToken,
    getRefreshToken,
    removeRefreshToken,
  };
};
