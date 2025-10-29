"use client"
export const useAccessToken = () => {

  const isBrowser = typeof window !== "undefined";

  const setAccessToken = (token: string) => {
    if (isBrowser) {
      localStorage.setItem("access_token", token);
    }
  };

  const getAccessToken = () => {
    if (isBrowser) {
      return localStorage.getItem("access_token");
    }
    return null;
  };

  const removeAccessToken = () => {
    if (isBrowser) {
      localStorage.removeItem("access_token");
    }
  };

  return {
    setAccessToken,
    getAccessToken,
    removeAccessToken,
  };
};